import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import type { RouteQueryString } from "@/modules/data/usecases/getDataForEtablissementMap/getDataForEtablissementMap.usecase";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Filters extends Pick<RouteQueryString, "bbox" | "cfd"> {}

export const getEtablissementsProches = async ({ cfd, bbox }: Filters) =>
  await getKbdClient()
    .selectFrom("etablissement")
    .leftJoin("formationEtablissement", "formationEtablissement.uai", "etablissement.uai")
    .leftJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "formationEtablissement.id")
    .leftJoin("dispositif", "dispositif.codeDispositif", "formationEtablissement.codeDispositif")
    .distinct()
    .select((sb) => [
      sql<string[]>`array_agg(distinct ${sb.ref("formationEtablissement.voie")})`.as("voies"),
      sql<string[]>`array_agg(distinct ${sb.ref("dispositif.libelleDispositif")})`.as("libellesDispositifs"),
      "etablissement.uai",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      sql<string>`trim(split_part(split_part(split_part(split_part(${sb.ref(
        "etablissement.libelleEtablissement"
      )},' - Lycée',1),' -Lycée',1),',',1),' : ',1))`.as("libelleEtablissement"),
    ])
    .where("indicateurEntree.rentreeScolaire", "=", CURRENT_RENTREE)
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
    .groupBy([
      "etablissement.uai",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
    ])
    .execute();
