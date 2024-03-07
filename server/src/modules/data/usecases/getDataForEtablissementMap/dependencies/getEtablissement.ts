import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { getDataForEtablissementMapSchema } from "../getDataForEtablissementMap.schema";

export interface Filters
  extends z.infer<typeof getDataForEtablissementMapSchema.params> {}

export const getEtablissement = async ({ uai }: Filters) =>
  await kdb
    .selectFrom("etablissement")
    .selectAll()
    .where("UAI", "=", uai)
    .executeTakeFirstOrThrow();
