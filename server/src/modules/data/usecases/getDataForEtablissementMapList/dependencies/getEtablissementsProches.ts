import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../../db/db";
import { effectifAnnee } from "../../../utils/effectifAnnee";
import { selectTauxInsertion6mois } from "../../../utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "../../../utils/tauxPoursuite";
import { RouteQueryString } from "../getDataForEtablissementMapList.usecase";

export interface Filters extends RouteQueryString {
  uai: string;
}

export const getEtablissementsProches = async ({ cfd, uai, bbox }: Filters) =>
  await kdb
    .selectFrom("etablissement")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .leftJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.dispositifId"
    )
    .leftJoin(
      "indicateurSortie",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id"
    )
    .distinct()
    .select((sb) => [
      sql<string[]>`array_agg(distinct ${sb.ref(
        "formationEtablissement.voie"
      )})`.as("voies"),
      sql<string[]>`array_agg(distinct ${sb.ref(
        "dispositif.libelleDispositif"
      )})`.as("libellesDispositifs"),
      "etablissement.UAI",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuite"),
      selectTauxInsertion6mois("indicateurSortie").as("tauxInsertion"),
      effectifAnnee({ alias: "indicateurEntree" }).as("effectif"),
    ])
    .where("formationEtablissement.UAI", "!=", uai)
    .where((eb) =>
      eb.or([
        eb("indicateurEntree.rentreeScolaire", "=", CURRENT_RENTREE),
        eb("indicateurEntree.rentreeScolaire", "is", null),
      ])
    )
    .where("indicateurEntree.rentreeScolaire", "=", CURRENT_RENTREE)
    .where("indicateurSortie.millesimeSortie", "=", CURRENT_IJ_MILLESIME)
    .$call((q) => {
      if (bbox !== undefined) {
        return q.where((eb) =>
          eb.and([
            eb("etablissement.longitude", ">=", parseFloat(bbox.minLng)),
            eb("etablissement.longitude", "<=", parseFloat(bbox.maxLng)),
            eb("etablissement.latitude", ">=", parseFloat(bbox.minLat)),
            eb("etablissement.latitude", "<=", parseFloat(bbox.maxLat)),
          ])
        );
      }
      return q;
    })
    .$call((q) => {
      if (cfd !== undefined && cfd.length > 0) {
        return q.where("formationEtablissement.cfd", "in", cfd);
      }
      return q;
    })
    .limit(100)
    .groupBy([
      "etablissement.UAI",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
      "indicateurSortie.effectifSortie",
      "indicateurSortie.nbSortants",
      "indicateurSortie.nbPoursuiteEtudes",
      "indicateurSortie.nbInsertion6mois",
      "indicateurEntree.effectifs",
      "indicateurEntree.anneeDebut",
    ])
    .execute();
