import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { getNormalizedSearchArray } from "../../../../utils/normalizeSearch";
import { capaciteAnnee } from "../../../utils/capaciteAnnee";
import { effectifAnnee } from "../../../utils/effectifAnnee";
import { hasContinuum } from "../../../utils/hasContinuum";
import { isInPerimetreIJEtablissement } from "../../../utils/isInPerimetreIJ";
import { isScolaireFormationHistorique } from "../../../utils/isScolaire";
import { notAnneeCommune } from "../../../utils/notAnneeCommune";
import {
  isHistoriqueCoExistant,
  notHistoriqueUnlessCoExistant,
} from "../../../utils/notHistorique";
import { openForRentreeScolaire } from "../../../utils/openForRentreeScolaire";
import { withTauxDevenirFavorableReg } from "../../../utils/tauxDevenirFavorable";
import { withInsertionReg } from "../../../utils/tauxInsertion6mois";
import { withPoursuiteReg } from "../../../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../../utils/tauxRemplissage";
import { Filters } from "../getFormations.usecase";

export const getFormationsQuery = async ({
  offset = 0,
  limit = MAX_LIMIT,
  rentreeScolaire = [CURRENT_RENTREE],
  millesimeSortie = CURRENT_IJ_MILLESIME,
  codeRegion,
  codeAcademie,
  codeDepartement,
  codeNiveauDiplome,
  codeDispositif,
  commune,
  cfd,
  cfdFamille,
  codeNsf,
  positionQuadrant,
  search,
  withEmptyFormations = "true",
  withAnneeCommune,
  order,
  orderBy,
}: Partial<Filters>) => {
  const search_array = getNormalizedSearchArray(search);

  const result = await kdb
    .selectFrom("formationScolaireView as formationView")
    .leftJoin("formationEtablissement", (join) =>
      join
        .onRef("formationEtablissement.cfd", "=", "formationView.cfd")
        .on("formationEtablissement.codeDispositif", "is not", null)
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.codeDispositif"
    )
    .leftJoin("familleMetier", "familleMetier.cfd", "formationView.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "in", rentreeScolaire)
    )
    .leftJoin("indicateurSortie", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurSortie.formationEtablissementId"
        )
        .on("indicateurSortie.millesimeSortie", "=", millesimeSortie)
    )
    .leftJoin(
      "etablissement",
      "etablissement.uai",
      "formationEtablissement.uai"
    )
    .leftJoin("formationHistorique", (join) =>
      join
        .onRef("formationHistorique.ancienCFD", "=", "formationView.cfd")
        .on(isScolaireFormationHistorique)
    )
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .$call((eb) => {
      if (!codeRegion) return eb;
      return eb
        .leftJoin("positionFormationRegionaleQuadrant", (join) =>
          join
            .onRef(
              "positionFormationRegionaleQuadrant.cfd",
              "=",
              "formationView.cfd"
            )
            .onRef(
              "positionFormationRegionaleQuadrant.codeDispositif",
              "=",
              "formationEtablissement.codeDispositif"
            )
            .onRef(
              "positionFormationRegionaleQuadrant.codeRegion",
              "=",
              "etablissement.codeRegion"
            )
            .on(
              "positionFormationRegionaleQuadrant.millesimeSortie",
              "=",
              millesimeSortie
            )
        )
        .select((eb) =>
          eb
            .case()
            .when(
              eb("formationView.typeFamille", "in", [
                "1ere_commune",
                "2nde_commune",
              ])
            )
            .then(
              sql<string>`
              COALESCE(
                ${eb.ref("positionQuadrant")},
                '-'
              )`
            )
            .else(
              sql<string>`
              COALESCE(
                ${eb.ref("positionQuadrant")},
                ${PositionQuadrantEnum["Hors quadrant"]}
              )`
            )
            .end()
            .as("positionQuadrant")
        )
        .$call((eb) => {
          if (!positionQuadrant) return eb;
          return eb.where("positionQuadrant", "in", positionQuadrant);
        })
        .groupBy("positionQuadrant");
    })
    .select((eb) => [
      sql<number>`COUNT(*) OVER()`.as("count"),
      sql<number>`
        COUNT("indicateurEntree"."rentreeScolaire")
      `.as("nbEtablissement"),
      "formationView.cfd",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.typeFamille",
      "formationView.cpc",
      "formationView.cpcSecteur",
      "nsf.libelleNsf",
      "familleMetier.libelleFamille",
      "libelleDispositif",
      "dispositif.codeDispositif",
      "libelleNiveauDiplome",
      "indicateurEntree.rentreeScolaire",
      sql<number>`max("indicateurEntree"."anneeDebut")`.as("anneeDebut"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectifEntree"),
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
        annee: sql`'0'`,
      })})`.as("effectif1"),
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
        annee: sql`'1'`,
      })})`.as("effectif2"),
      sql<number>`SUM(${effectifAnnee({
        alias: "indicateurEntree",
        annee: sql`'2'`,
      })})`.as("effectif3"),
      sql<number>`SUM(${capaciteAnnee({ alias: "indicateurEntree" })})
      `.as("capacite"),
      sql<number>`SUM(${capaciteAnnee({
        alias: "indicateurEntree",
        annee: sql`'0'`,
      })})`.as("capacite1"),
      sql<number>`SUM(${capaciteAnnee({
        alias: "indicateurEntree",
        annee: sql`'1'`,
      })})`.as("capacite2"),
      sql<number>`SUM(${capaciteAnnee({
        alias: "indicateurEntree",
        annee: sql`'2'`,
      })})`.as("capacite3"),
      selectTauxPressionAgg("indicateurEntree", "formationView").as(
        "tauxPression"
      ),
      hasContinuum({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as("continuum"),
      withPoursuiteReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxPoursuite"),
      withInsertionReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxInsertion"),
      withTauxDevenirFavorableReg({
        eb,
        millesimeSortie,
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as("tauxDevenirFavorable"),
      isHistoriqueCoExistant(eb, rentreeScolaire[0]).as(
        "isHistoriqueCoExistant"
      ),
      "formationHistorique.cfd as formationRenovee",
      eb
        .selectFrom("formationHistorique")
        .select("formationHistorique.cfd")
        .whereRef("formationHistorique.cfd", "=", "formationView.cfd")
        .where("formationHistorique.ancienCFD", "in", (eb) =>
          eb.selectFrom("formationEtablissement").select("cfd")
        )
        .limit(1)
        .as("isFormationRenovee"),
      sql<string | null>`
          case when ${eb.ref("formationView.dateFermeture")} is not null
          then to_char(${eb.ref("formationView.dateFermeture")}, 'dd/mm/yyyy')
          else null
          end
        `.as("dateFermeture"),
    ])
    .where(isInPerimetreIJEtablissement)
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire[0]))
    .where((eb) => openForRentreeScolaire(eb, rentreeScolaire[0]))
    .where((eb) =>
      eb.or([
        eb("indicateurEntree.rentreeScolaire", "is not", null),
        withEmptyFormations === "true"
          ? eb.not(
              eb.exists(
                eb
                  .selectFrom("formationEtablissement as fe")
                  .select("fe.cfd")
                  .distinct()
                  .innerJoin(
                    "indicateurEntree",
                    "id",
                    "formationEtablissementId"
                  )
                  .where("rentreeScolaire", "in", rentreeScolaire)
                  .whereRef(
                    "fe.codeDispositif",
                    "=",
                    "formationEtablissement.codeDispositif"
                  )
                  .whereRef("fe.cfd", "=", "formationEtablissement.cfd")
              )
            )
          : sql<boolean>`false`,
      ])
    )
    .groupBy([
      "formationEtablissement.cfd",
      "formationView.id",
      "formationView.cfd",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.typeFamille",
      "formationView.dateFermeture",
      "formationView.cpc",
      "formationView.cpcSecteur",
      "nsf.libelleNsf",
      "formationHistorique.cfd",
      "indicateurEntree.rentreeScolaire",
      "dispositif.libelleDispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.codeDispositif",
      "libelleFamille",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("formationView.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("niveauDiplome.libelleNiveauDiplome")}),
                  ' ',
                  unaccent(${eb.ref("dispositif.libelleDispositif")}),
                  ' ',
                  unaccent(${eb.ref("nsf.libelleNsf")}),
                  ' ',
                  unaccent(${eb.ref("formationView.cpc")}),
                  ' ',
                  unaccent(${eb.ref("formationView.cpcSecteur")})
                )`,
                "ilike",
                `%${search_word}%`
              )
            )
          )
        );
      return eb;
    })
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("etablissement.codeRegion", "in", codeRegion);
    })
    .$call((q) => {
      if (!codeAcademie) return q;
      return q.where("etablissement.codeAcademie", "in", codeAcademie);
    })
    .$call((q) => {
      if (!codeDepartement) return q;
      return q.where("etablissement.codeDepartement", "in", codeDepartement);
    })
    .$call((q) => {
      if (!cfd) return q;
      return q.where("formationView.cfd", "in", cfd);
    })
    .$call((q) => {
      if (!commune) return q;
      return q.where("etablissement.commune", "in", commune);
    })
    .$call((q) => {
      if (!codeDispositif) return q;
      return q.where(
        "formationEtablissement.codeDispositif",
        "in",
        codeDispositif
      );
    })
    .$call((q) => {
      if (!codeNiveauDiplome) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .$call((q) => {
      if (!cfdFamille) return q;
      return q.where((w) =>
        w.or([
          w("familleMetier.cfdFamille", "in", cfdFamille),
          w.and([
            w("formationView.typeFamille", "=", "2nde_commune"),
            w("formationView.cfd", "in", cfdFamille),
          ]),
        ])
      );
    })
    .$call((q) => {
      if (!codeNsf) return q;
      return q.where("formationView.codeNsf", "in", codeNsf);
    })
    .$call((q) => {
      if (withAnneeCommune === "false") return q.where(notAnneeCommune);
      return q;
    })
    .$call((q) => {
      if (!orderBy || !order) return q;
      // disable ordering by positionQuadrant if codeRegion is not set
      if (!codeRegion && orderBy === "positionQuadrant") return q;
      return q.orderBy(sql.ref(orderBy), sql`${sql.raw(order)} NULLS LAST`);
    })
    .orderBy("libelleFormation", "asc")
    .orderBy("libelleNiveauDiplome", "asc")
    .orderBy("libelleDispositif", "asc")
    .orderBy("formationView.cfd", "asc")
    .orderBy("nbEtablissement", "asc")
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    count: result[0]?.count ?? 0,
    formations: result.map((formation) =>
      cleanNull({
        ...formation,
        isFormationRenovee: !!formation.isFormationRenovee,
      })
    ),
  };
};
