import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { getDataForEtablissementMapListSchema } from "../getDataForEtablissementMapList.schema";

export interface Filters
  extends z.infer<typeof getDataForEtablissementMapListSchema.params> {}

export const getEtablissement = async ({ uai }: Filters) =>
  await kdb
    .selectFrom("etablissement")
    .selectAll()
    .where("UAI", "=", uai)
    .executeTakeFirstOrThrow();
