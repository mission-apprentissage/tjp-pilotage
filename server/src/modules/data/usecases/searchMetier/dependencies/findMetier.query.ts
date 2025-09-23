import type { searchMetierSchema } from "shared/routes/schemas/get.metier.search.search.schema";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import { getNormalizedSearch } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

export const findMetierQuery = async ({
  search,
  filters,
  limit = 100,
}: {
  search: string;
  filters: z.infer<typeof searchMetierSchema.querystring>;
  limit?: number;
}) => {
  const cleanSearch = getNormalizedSearch(search);
  const formations = await getKbdClient()
    .selectFrom("metier")
    .leftJoin("rome", "rome.codeRome", "metier.codeRome")
    .$call((q) => {
      if (filters.codeDomaineProfessionnel) {
        return q.where("rome.codeDomaineProfessionnel", "=", filters.codeDomaineProfessionnel);
      }

      return q;
    })
    .where("metier.libelleMetier", "ilike", `%${cleanSearch}%`)
    .where("metier.libelleMetier", "is not", null)
    .select(["metier.libelleMetier", "metier.codeMetier"])
    .orderBy("metier.libelleMetier asc")
    .limit(limit)
    .execute()
    .then(cleanNull);

  return formations;
};
