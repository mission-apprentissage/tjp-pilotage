import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../../db/db";
import { RouteQueryString } from "../getDataForEtablissementMap.usecase";

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
    .distinct()
    .select([
      "formationEtablissement.voie",
      "dispositif.libelleDispositif",
      "etablissement.UAI",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
    ])
    .where("formationEtablissement.UAI", "!=", uai)
    .where((eb) =>
      eb.or([
        eb("indicateurEntree.rentreeScolaire", "=", CURRENT_RENTREE),
        eb("indicateurEntree.rentreeScolaire", "is", null),
      ])
    )
    .$call((q) => {
      if (bbox !== undefined) {
        return q.where((eb) =>
          eb.and([
            eb("etablissement.longitude", ">=", parseFloat(bbox.x1)),
            eb("etablissement.longitude", "<=", parseFloat(bbox.x2)),
            eb("etablissement.latitude", ">=", parseFloat(bbox.y1)),
            eb("etablissement.latitude", "<=", parseFloat(bbox.y2)),
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
    .execute();
