import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
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
import { premiersVoeuxAnnee } from "../../../utils/premiersVoeuxAnnee";
import {
  selectTauxDevenirFavorableAgg,
  withTauxDevenirFavorableReg,
} from "../../../utils/tauxDevenirFavorable";
import {
  selectTauxInsertion6mois,
  withInsertionReg,
} from "../../../utils/tauxInsertion6mois";
import {
  selectTauxPoursuite,
  withPoursuiteReg,
} from "../../../utils/tauxPoursuite";
import { selectTauxPression } from "../../../utils/tauxPression";
import { selectTauxRemplissage } from "../../../utils/tauxRemplissage";
import { Filters } from "../getFormationEtablissements.usecase";

export const getFormationEtablissementsQuery = async ({
  offset = 0,
  limit = 20,
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
  uai,
  secteur,
  codeNsf,
  withAnneeCommune,
  order,
  orderBy,
}: Partial<Filters>) => {
  const result = await kdb
    .selectFrom("formationScolaireView as formationView")
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
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
    .innerJoin("indicateurEntree", (join) =>
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
          "indicateurSortie.formationEtablissementId",
          "=",
          "formationEtablissement.id"
        )
        .on("indicateurSortie.millesimeSortie", "=", millesimeSortie)
    )
    .innerJoin(
      "etablissement",
      "etablissement.uai",
      "formationEtablissement.uai"
    )
    .leftJoin("indicateurEtablissement", (join) =>
      join
        .onRef("etablissement.uai", "=", "indicateurEtablissement.uai")
        .on("indicateurEtablissement.millesime", "=", millesimeSortie)
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "etablissement.codeDepartement"
    )
    .leftJoin("academie", "academie.codeAcademie", "etablissement.codeAcademie")
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .leftJoin(
      "dataFormation as dataFormationContinuum",
      "dataFormationContinuum.cfd",
      "indicateurSortie.cfdContinuum"
    )
    .leftJoin("formationHistorique", (join) =>
      join
        .onRef("formationHistorique.ancienCFD", "=", "formationView.cfd")
        .on(isScolaireFormationHistorique)
    )
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("positionFormationRegionaleQuadrant.cfd"),
            "=",
            eb.ref("formationEtablissement.cfd")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeDispositif"),
            "=",
            eb.ref("formationEtablissement.codeDispositif")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
            "=",
            eb.ref("etablissement.codeRegion")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            millesimeSortie
          ),
        ])
      )
    )
    .select((eb) => [
      sql<number>`COUNT(*) OVER()`.as("count"),
      "etablissement.libelleEtablissement",
      "etablissement.secteur",
      "etablissement.commune",
      "formationView.cfd",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.cpc",
      "formationView.cpcSecteur",
      "nsf.libelleNsf",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie",
      "region.libelleRegion",
      "etablissement.codeRegion",
      "etablissement.uai as uai",
      "formationView.typeFamille",
      "familleMetier.libelleFamille",
      "libelleDispositif",
      "formationEtablissement.codeDispositif",
      "libelleNiveauDiplome",
      "indicateurEntree.rentreeScolaire",
      "indicateurEtablissement.valeurAjoutee",
      "anneeDebut",
      "formationHistorique.cfd as formationRenovee",
      eb.fn
        .coalesce(
          "positionFormationRegionaleQuadrant.positionQuadrant",
          eb.val(PositionQuadrantEnum["Hors quadrant"])
        )
        .as("positionQuadrant"),
      selectTauxRemplissage("indicateurEntree").as("tauxRemplissage"),
      effectifAnnee({ alias: "indicateurEntree" }).as("effectifEntree"),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'0'` }).as(
        "effectif1"
      ),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'1'` }).as(
        "effectif2"
      ),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'2'` }).as(
        "effectif3"
      ),
      capaciteAnnee({ alias: "indicateurEntree" }).as("capacite"),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'0'` }).as(
        "capacite1"
      ),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'1'` }).as(
        "capacite2"
      ),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'2'` }).as(
        "capacite3"
      ),
      premiersVoeuxAnnee({ alias: "indicateurEntree" }).as("premiersVoeux"),
      selectTauxPression("indicateurEntree", "formationView", false).as(
        "tauxPression"
      ),
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuiteEtablissement"),
      selectTauxInsertion6mois("indicateurSortie").as(
        "tauxInsertionEtablissement"
      ),
      selectTauxDevenirFavorableAgg("indicateurSortie").as(
        "tauxDevenirFavorableEtablissement"
      ),
      isHistoriqueCoExistant(eb, rentreeScolaire[0]).as(
        "isHistoriqueCoExistant"
      ),
      eb
        .case()
        .when("indicateurSortie.cfdContinuum", "is not", null)
        .then(
          jsonBuildObject({
            cfd: eb.ref("indicateurSortie.cfdContinuum"),
            libelleFormation: eb.ref("dataFormationContinuum.libelleFormation"),
          })
        )
        .end()
        .as("continuumEtablissement"),

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
    .$narrowType<{
      continuumEtablissement: { cfd: string; libelleFormation: string };
    }>()
    .select([
      (eb) =>
        hasContinuum({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }).as("continuum"),
      (eb) =>
        withPoursuiteReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxPoursuite"),
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxInsertion"),
      (eb) =>
        withTauxDevenirFavorableReg({
          eb,
          millesimeSortie,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }).as("tauxDevenirFavorable"),
    ])
    .$call((q) => {
      if (!withAnneeCommune || withAnneeCommune === "false")
        return q.where(notAnneeCommune);
      return q;
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
      return q.where("dispositif.codeDispositif", "in", codeDispositif);
    })
    .$call((q) => {
      if (!codeNiveauDiplome) return q;
      return q.where("dispositif.codeNiveauDiplome", "in", codeNiveauDiplome);
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
      if (!uai) return q;
      return q.where("etablissement.uai", "in", uai);
    })
    .$call((q) => {
      if (!secteur) return q;
      return q.where("etablissement.secteur", "in", secteur);
    })
    .$call((q) => {
      if (!codeNsf) return q;
      return q.where("formationView.codeNsf", "in", codeNsf);
    })
    .where(isInPerimetreIJEtablissement)
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire[0]))
    .groupBy([
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
      "etablissement.id",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie",
      "region.libelleRegion",
      "indicateurEntree.rentreeScolaire",
      "indicateurEntree.formationEtablissementId",
      "indicateurSortie.formationEtablissementId",
      "indicateurSortie.millesimeSortie",
      "dataFormationContinuum.libelleFormation",
      "formationEtablissement.id",
      "formationEtablissement.codeDispositif",
      "libelleDispositif",
      "libelleFamille",
      "libelleNiveauDiplome",
      "indicateurEtablissement.uai",
      "indicateurEtablissement.millesime",
      "positionFormationRegionaleQuadrant.positionQuadrant",
    ])
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql.ref(orderBy), sql`${sql.raw(order)} NULLS LAST`);
    })
    .orderBy("etablissement.libelleEtablissement", "asc")
    .orderBy("formationView.libelleFormation", "asc")
    .orderBy("libelleNiveauDiplome", "asc")
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    count: result[0]?.count ?? 0,
    etablissements: result.map((etablissement) =>
      cleanNull({
        ...etablissement,
        isFormationRenovee: !!etablissement.isFormationRenovee,
      })
    ),
  };
};
