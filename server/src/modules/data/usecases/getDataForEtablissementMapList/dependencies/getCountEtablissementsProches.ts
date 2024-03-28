import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../../db/db";
import { RouteQueryString } from "../getDataForEtablissementMapList.usecase";

export interface Filters extends RouteQueryString {
  uai: string;
}

export const getCountEtablissementsProches = async ({
  cfd,
  uai,
  bbox,
}: Filters) =>
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
      "indicateurSortie",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id"
    )
    .select((sb) => sb.fn.count<number>("etablissement.UAI").over().as("count"))
    .where("formationEtablissement.UAI", "!=", uai)
    .where((eb) =>
      eb.or([
        eb("indicateurEntree.rentreeScolaire", "=", CURRENT_RENTREE),
        eb("indicateurEntree.rentreeScolaire", "is", null),
      ])
    )
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
    .groupBy(["etablissement.UAI", "formationEtablissement.cfd"])
    .limit(1)
    .execute();
