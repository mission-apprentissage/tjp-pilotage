import { sql } from "kysely";
import type { getDataForEtablissementMapSchema } from "shared/routes/schemas/get.etablissement.uai.map.schema";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";

export interface Filters extends z.infer<typeof getDataForEtablissementMapSchema.params> {
  cfd?: string[];
}

export const getEtablissement = async ({ uai, cfd }: Filters) =>
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
    .$call((q) => {
      if (cfd !== undefined && cfd.length > 0) {
        return q.where("formationEtablissement.cfd", "in", cfd);
      }
      return q;
    })
    .where("etablissement.uai", "=", uai)
    .groupBy([
      "etablissement.uai",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
    ])
    .executeTakeFirst();
