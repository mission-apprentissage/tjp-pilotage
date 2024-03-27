import { sql } from "kysely";
import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { getDataForEtablissementMapSchema } from "../getDataForEtablissementMap.schema";

export interface Filters
  extends z.infer<typeof getDataForEtablissementMapSchema.params> {
  cfd?: string[];
}

export const getEtablissement = async ({ uai, cfd }: Filters) =>
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
    ])
    .$call((q) => {
      if (cfd !== undefined && cfd.length > 0) {
        return q.where("formationEtablissement.cfd", "in", cfd);
      }
      return q;
    })
    .where("etablissement.UAI", "=", uai)
    .groupBy([
      "etablissement.UAI",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
    ])
    .executeTakeFirst();
