import { sql } from "kysely";
import type { VoieType } from "shared";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import type { Etablissement, EtablissementsOrderBy } from "shared/routes/schemas/get.formation.cfd.map.schema";

import { getKbdClient } from "@/db/db";
import { selectTauxDevenirFavorable } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPression } from "@/modules/data/utils/tauxPression";
import { cleanNull } from "@/utils/noNull";

export const getEtablissements = async ({
  cfd,
  codeRegion,
  codeDepartement,
  codeAcademie,
  orderBy,
  includeAll,
  voie
}: {
  cfd: string;
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
  orderBy?: EtablissementsOrderBy;
  includeAll: boolean;
  voie?: VoieType;
}) =>
  getKbdClient()
    .with("taux_ij_formation_etab", (db) =>
      db
        .selectFrom("formationEtablissement")
        .leftJoin("indicateurSortie", (join) =>
          join
            .onRef("indicateurSortie.formationEtablissementId", "=", "formationEtablissement.id")
            .on("millesimeSortie", "=", CURRENT_IJ_MILLESIME)
        )
        .select([
          "cfd",
          "uai",
          "codeDispositif",
          "voie",
          sql<string>`${sql.ref("cfd")} || ${sql.ref("uai")} || coalesce(${sql.ref("codeDispositif")},'') || ${sql.ref(
            "voie"
          )}`.as("offre"),
          "millesimeSortie",
          selectTauxInsertion6mois("indicateurSortie").as("tauxInsertion"),
          selectTauxPoursuite("indicateurSortie").as("tauxPoursuite"),
          selectTauxDevenirFavorable("indicateurSortie").as("tauxDevenirFavorable"),
          "effectifSortie",
          "nbPoursuiteEtudes",
          "nbSortants",
          "nbInsertion6mois",
        ])
    )
    .with("carto", (db) =>
      db
        .selectFrom("etablissement")
        .leftJoin("formationEtablissement", "etablissement.uai", "formationEtablissement.uai")
        .leftJoin("indicateurEntree", "formationEtablissement.id", "indicateurEntree.formationEtablissementId")
        .leftJoin("dataFormation", "formationEtablissement.cfd", "dataFormation.cfd")
        .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
        .leftJoin("niveauDiplome", "dataFormation.codeNiveauDiplome", "niveauDiplome.codeNiveauDiplome")
        .leftJoin("dispositif", "dispositif.codeDispositif", "formationEtablissement.codeDispositif")
        .leftJoin("taux_ij_formation_etab", (join) =>
          join.onRef(
            "taux_ij_formation_etab.offre",
            "=",
            sql`${sql.ref("formationEtablissement.cfd")} || ${sql.ref(
              "formationEtablissement.uai"
            )} || coalesce(${sql.ref(
              "formationEtablissement.codeDispositif"
            )},'') || ${sql.ref("formationEtablissement.voie")}`
          )
        )
        .select((sb) => [
          "etablissement.uai",
          sql<string>`trim(split_part(split_part(split_part(split_part(${sb.ref(
            "etablissement.libelleEtablissement"
          )},' - Lycée',1),' -Lycée',1),',',1),' : ',1))`.as("libelleEtablissement"),
          "etablissement.commune",
          "etablissement.latitude",
          "etablissement.longitude",
          "etablissement.sourceGeoloc",
          "formationEtablissement.cfd",
          "formationEtablissement.codeDispositif",
          "formationEtablissement.voie",
          "indicateurEntree.rentreeScolaire",
          "indicateurEntree.capacites",
          "indicateurEntree.premiersVoeux",
          "taux_ij_formation_etab.tauxInsertion",
          "taux_ij_formation_etab.tauxPoursuite",
          "taux_ij_formation_etab.tauxDevenirFavorable",
          "dataFormation.libelleFormation",
          "niveauDiplome.libelleNiveauDiplome",
          "libelleNsf",
          "codeDepartement",
          "codeAcademie",
          "codeRegion",
          sb.fn.coalesce(sb.ref("dispositif.libelleDispositif"), sql<string>`''`).as("libelleDispositif"),
          "secteur",
          sql<number>`(effectifs->>${sb.ref("anneeDebut")})::integer`.as("effectifs"),
          selectTauxPression("indicateurEntree", "niveauDiplome", true).as("tauxPression"),
        ])
        .where("rentreeScolaire", "=", CURRENT_RENTREE)
        .$call((qb) => {
          if (voie) {
            return qb.where(wb => wb("formationEtablissement.voie", "=", wb.val(voie)));
          }
          return qb;
        })
    )
    .selectFrom("carto")
    .select((sb) => [
      sb.ref("carto.uai").as("uai"),
      sb.ref("carto.libelleEtablissement").as("libelleEtablissement"),
      sb.ref("carto.commune").as("commune"),
      sb.ref("carto.codeAcademie").as("codeAcademie"),
      sb.ref("carto.codeRegion").as("codeRegion"),
      sb.ref("carto.latitude").as("latitude"),
      sb.ref("carto.longitude").as("longitude"),
      sb.ref("carto.secteur").as("secteur"),
      sb.ref("carto.codeDepartement").as("codeDepartement"),
      sb.fn.sum("carto.tauxInsertion").as("tauxInsertion"),
      sb.fn.sum("carto.tauxDevenirFavorable").as("tauxDevenirFavorable"),
      sb.fn.sum("carto.tauxPoursuite").as("tauxPoursuite"),
      sb.fn.sum("carto.effectifs").as("effectifs"),
      sb.fn.sum("carto.tauxPression").as("tauxPression"),
      sql<boolean>`bool_or(${sb.ref("carto.voie")} = 'apprentissage' OR ${sb.ref("carto.voie")} IS NULL)`.as(
        "isApprentissage"
      ),
      sql<boolean>`bool_or(${sb.ref("carto.voie")} = 'scolaire' OR ${sb.ref("carto.voie")} IS NULL)`.as("isScolaire"),
      sql<boolean>`case when left(${sb.ref("carto.cfd")}, 3) = '320' then true else false end`.as("isBTS"),
      sql<string[]>`array_agg(distinct ${sb.ref("carto.libelleDispositif")})`.as("libellesDispositifs"),
    ])
    .where("carto.cfd", "=", cfd)
    .where("carto.libelleEtablissement", "is not", null)
    .where((wb) => wb.and([wb("carto.longitude", "is not", null), wb("carto.latitude", "is not", null)]))
    .$call((qb) => {
      if (includeAll) {
        return qb;
      }

      if (codeRegion) {
        qb = qb.where("carto.codeRegion", "=", codeRegion);
      }

      if (codeAcademie) {
        qb = qb.where("carto.codeAcademie", "=", codeAcademie);
      }

      if (codeDepartement) {
        qb = qb.where("carto.codeDepartement", "=", codeDepartement);
      }

      return qb;
    })
    .groupBy([
      "carto.cfd",
      "carto.uai",
      "carto.libelleEtablissement",
      "carto.commune",
      "carto.codeAcademie",
      "carto.codeRegion",
      "carto.latitude",
      "carto.longitude",
      "carto.secteur",
      "carto.codeDepartement",
    ])
    .$if(orderBy === "departement_commune", (qb) => qb.orderBy(["carto.codeDepartement asc", "carto.commune asc"]))
    .$if(orderBy === "libelle", (qb) => qb.orderBy("carto.libelleEtablissement", "asc"))
    .$castTo<Etablissement>()
    .execute()
    .then((result) => cleanNull(result));
