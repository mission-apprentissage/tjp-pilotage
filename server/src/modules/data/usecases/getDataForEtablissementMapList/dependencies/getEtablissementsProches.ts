import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import type { RouteQueryString } from "@/modules/data/usecases/getDataForEtablissementMapList/getDataForEtablissementMapList.usecase";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { selectTauxInsertion6mois } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "@/modules/data/utils/tauxPoursuite";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Filters extends RouteQueryString {}

export const getEtablissementsProches = async ({ cfd, bbox, limit = 100 }: Filters) =>
  await getKbdClient()
    .selectFrom("etablissement")
    .leftJoin("formationEtablissement", "formationEtablissement.uai", "etablissement.uai")
    .leftJoin("dataFormation", "dataFormation.cfd", "formationEtablissement.cfd")
    .leftJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "formationEtablissement.id")
    .leftJoin("dispositif", "dispositif.codeDispositif", "formationEtablissement.codeDispositif")
    .leftJoin("indicateurSortie", "indicateurSortie.formationEtablissementId", "formationEtablissement.id")
    .innerJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .innerJoin("academie", "academie.codeAcademie", "etablissement.codeAcademie")
    .distinct()
    .select((sb) => [
      "dataFormation.libelleFormation",
      sql<string[]>`array_agg(distinct ${sb.ref("formationEtablissement.voie")})`.as("voies"),
      sql<string[]>`array_agg(distinct ${sb.ref("dispositif.libelleDispositif")})`.as("libellesDispositifs"),
      "etablissement.uai",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.secteur",
      sql<string>`trim(split_part(split_part(split_part(split_part(${sb.ref(
        "etablissement.libelleEtablissement"
      )},' - Lycée',1),' -Lycée',1),',',1),' : ',1))`.as("libelleEtablissement"),
      "region.libelleRegion",
      "academie.libelleAcademie",
      sb.fn.max(selectTauxPoursuite("indicateurSortie")).as("tauxPoursuite"),
      sb.fn.max(selectTauxInsertion6mois("indicateurSortie")).as("tauxInsertion"),
      sb.fn.max(effectifAnnee({ alias: "indicateurEntree" })).as("effectif"),
    ])
    .where("indicateurEntree.rentreeScolaire", "=", CURRENT_RENTREE)
    .where((eb) =>
      eb.or([
        eb("indicateurSortie.millesimeSortie", "=", CURRENT_IJ_MILLESIME),
        eb("indicateurSortie.millesimeSortie", "is", null),
      ])
    )
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
    .limit(limit)
    .groupBy([
      "dataFormation.libelleFormation",
      "etablissement.uai",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
      "etablissement.secteur",
      "region.libelleRegion",
      "academie.libelleAcademie",
    ])
    .execute();
