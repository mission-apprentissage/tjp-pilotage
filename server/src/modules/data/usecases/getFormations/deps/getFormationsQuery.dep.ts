import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import type { TypeFamille } from 'shared/enum/typeFamilleEnum';
import { TypeFamilleEnum } from 'shared/enum/typeFamilleEnum';
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getFormations/getFormations.usecase";
import { capaciteAnnee } from "@/modules/data/utils/capaciteAnnee";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { hasContinuum } from "@/modules/data/utils/hasContinuum";
import { isInPerimetreIJEtablissement } from "@/modules/data/utils/isInPerimetreIJ";
import { isScolaireFormationHistorique } from "@/modules/data/utils/isScolaire";
import { notAnneeCommune } from "@/modules/data/utils/notAnneeCommune";
import { isHistoriqueCoExistant, notHistoriqueUnlessCoExistantIndicateurEntree } from "@/modules/data/utils/notHistorique";
import { openForRentreeScolaireIndicateurEntree } from "@/modules/data/utils/openForRentreeScolaire";
import { selectTauxDemandeAgg } from "@/modules/data/utils/tauxDemande";
import { withTauxDevenirFavorableReg } from "@/modules/data/utils/tauxDevenirFavorable";
import { withInsertionReg } from "@/modules/data/utils/tauxInsertion6mois";
import { withPoursuiteReg } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPressionAgg } from "@/modules/data/utils/tauxPression";
import { selectTauxRemplissageAgg } from "@/modules/data/utils/tauxRemplissage";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { isFormationRenovee } from '@/modules/utils/isFormationRenovee';
import { getNormalizedSearchArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

export const getFormationsQuery = async ({
  offset = 0,
  limit = MAX_LIMIT,
  rentreeScolaire = [CURRENT_RENTREE],
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
  formationSpecifique,
  withAnneeCommune,
  order,
  orderBy,
}: Partial<Filters>) => {
  const search_array = getNormalizedSearchArray(search);
  const millesimeSortie = getMillesimeFromRentreeScolaire({ rentreeScolaire: CURRENT_RENTREE });

  const result = await getKbdClient()
    .selectFrom("formationScolaireView as formationView")
    .leftJoin("formationEtablissement", (join) =>
      join
        .onRef("formationEtablissement.cfd", "=", "formationView.cfd")
        .onRef("formationEtablissement.voie", "=", "formationView.voie")
    )
    .innerJoin("dataFormation", "dataFormation.cfd", "formationView.cfd")
    .leftJoin("dispositif", "dispositif.codeDispositif", "formationEtablissement.codeDispositif")
    .leftJoin("familleMetier", "familleMetier.cfd", "formationView.cfd")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "indicateurEntree.formationEtablissementId")
        .on("indicateurEntree.rentreeScolaire", "in", rentreeScolaire)
    )
    .leftJoin("indicateurSortie", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "indicateurSortie.formationEtablissementId")
        .on("indicateurSortie.millesimeSortie", "=", millesimeSortie)
    )
    .leftJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
    .leftJoin("formationHistorique", (join) =>
      join.onRef("formationHistorique.ancienCFD", "=", "formationView.cfd").on(isScolaireFormationHistorique)
    )
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .leftJoin("actionPrioritaire", (join) =>
      join
        .onRef("actionPrioritaire.cfd", "=", "formationEtablissement.cfd")
        .onRef("actionPrioritaire.codeDispositif", "=", "formationEtablissement.codeDispositif")
        .onRef("actionPrioritaire.codeRegion", "=", "etablissement.codeRegion")
    )
    .$call((eb) => {
      if (!codeRegion) return eb;
      return eb
        .leftJoin("positionFormationRegionaleQuadrant", (join) =>
          join
            .onRef("positionFormationRegionaleQuadrant.cfd", "=", "formationView.cfd")
            .onRef("positionFormationRegionaleQuadrant.codeDispositif", "=", "formationEtablissement.codeDispositif")
            .onRef("positionFormationRegionaleQuadrant.codeRegion", "=", "etablissement.codeRegion")
            .on("positionFormationRegionaleQuadrant.millesimeSortie", "=", millesimeSortie)
        )
        .select((eb) => [
          eb
            .case()
            .when(eb("formationView.typeFamille", "in", [TypeFamilleEnum["1ere_commune"], TypeFamilleEnum["2nde_commune"]]))
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
            .as("positionQuadrant"),
          isFormationActionPrioritaire({
            cfdRef: "formationEtablissement.cfd",
            codeDispositifRef: "formationEtablissement.codeDispositif",
            codeRegionRef: "etablissement.codeRegion",
          }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
        ])
        .$call((eb) => {
          if (!positionQuadrant) return eb;
          return eb.where("positionQuadrant", "in", positionQuadrant);
        })
        .groupBy(["positionQuadrant", "etablissement.codeRegion"]);
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
      sql<string>`COALESCE("dispositif"."libelleDispositif","niveauDiplome"."libelleNiveauDiplome" || ' SANS DISPOSITIF')`.as("libelleDispositif"),
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
      sql<string>`COALESCE("indicateurEntree"."rentreeScolaire",${CURRENT_RENTREE})`.as("rentreeScolaire"),
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
      selectTauxPressionAgg("indicateurEntree", "formationView").as("tauxPression"),
      selectTauxDemandeAgg("indicateurEntree", "formationView").as("tauxDemande"),
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
      isHistoriqueCoExistant(eb, rentreeScolaire[0]).as("isHistoriqueCoExistant"),
      "formationHistorique.cfd as formationRenovee",
      isFormationRenovee({ eb, rentreeScolaire: rentreeScolaire[0] })
        .as("isFormationRenovee"),
      sql<string | null>`
          case when ${eb.ref("formationView.dateFermeture")} is not null
          then to_char(${eb.ref("formationView.dateFermeture")}, 'dd/mm/yyyy')
          else null
          end
        `.as("dateFermeture"),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
    ])
    .where(isInPerimetreIJEtablissement)
    .where(notHistoriqueUnlessCoExistantIndicateurEntree)
    .where(openForRentreeScolaireIndicateurEntree)
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
                .innerJoin("indicateurEntree", "id", "formationEtablissementId")
                .where("rentreeScolaire", "in", rentreeScolaire)
                .whereRef("fe.codeDispositif", "=", "formationEtablissement.codeDispositif")
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
      "formationView.isTransitionDemographique",
      "formationView.isTransitionEcologique",
      "formationView.isTransitionNumerique",
      "dataFormation.cfd",
      "nsf.libelleNsf",
      "formationHistorique.cfd",
      "indicateurEntree.rentreeScolaire",
      "dispositif.libelleDispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.codeDispositif",
      "libelleFamille",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$narrowType<{
      typeFamille: TypeFamille;
    }>()
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
      return q.where("formationEtablissement.codeDispositif", "in", codeDispositif);
    })
    .$call((q) => {
      if (!codeNiveauDiplome) return q;
      return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .$call((q) => {
      if (!cfdFamille) return q;
      return q.where((w) =>
        w.or([
          w("familleMetier.cfdFamille", "in", cfdFamille),
          w.and([w("formationView.typeFamille", "=", TypeFamilleEnum["2nde_commune"]), w("formationView.cfd", "in", cfdFamille)]),
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
    .$call((q) => {
      if (formationSpecifique?.length) {
        return q.where((w) =>
          w.or([
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Action prioritaire"])
              ? w("actionPrioritaire.cfd", "is not", null)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition écologique"])
              ? w("formationView.isTransitionEcologique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition démographique"])
              ? w("formationView.isTransitionDemographique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition numérique"])
              ? w("formationView.isTransitionNumerique", "=", true)
              : sql.val(false),
          ])
        );
      }
      return q;
    })
    .orderBy("libelleFormation", "asc")
    .orderBy("libelleNiveauDiplome", "asc")
    .orderBy("libelleDispositif", "asc")
    .orderBy("formationView.cfd", "asc")
    .orderBy("nbEtablissement", "asc")
    .offset(offset)
    .limit(limit)
    .execute()
    .then(cleanNull);

  return {
    count: result[0]?.count ?? 0,
    formations: result.map((formation) => ({
      ...formation,
      isFormationRenovee: !!formation.isFormationRenovee,
      formationSpecifique: formatFormationSpecifique({
        ...formation,
        [TypeFormationSpecifiqueEnum["Action prioritaire"]]:
          TypeFormationSpecifiqueEnum["Action prioritaire"] in formation
            ? !!formation[TypeFormationSpecifiqueEnum["Action prioritaire"]]
            : false,
      }),
    })),
  };
};
