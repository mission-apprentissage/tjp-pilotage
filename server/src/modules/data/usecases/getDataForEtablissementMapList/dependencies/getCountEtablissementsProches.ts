import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import type { RouteQueryString } from "@/modules/data/usecases/getDataForEtablissementMapList/getDataForEtablissementMapList.usecase";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Filters extends RouteQueryString {}

export const getCountEtablissementsProches = async ({ cfd, bbox }: Filters) =>
  await getKbdClient()
    .selectFrom("etablissement")
    .leftJoin("formationEtablissement", "formationEtablissement.uai", "etablissement.uai")
    .leftJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "formationEtablissement.id")
    .leftJoin("indicateurSortie", "indicateurSortie.formationEtablissementId", "formationEtablissement.id")
    .select((sb) => sb.fn.count<number>("etablissement.uai").over().as("count"))
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
    .groupBy(["etablissement.uai", "formationEtablissement.cfd"])
    .limit(1)
    .execute();
