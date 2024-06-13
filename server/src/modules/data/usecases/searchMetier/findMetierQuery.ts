import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { searchMetierSchema } from "./searchMetier.schema";

export const findMetierQuery = async ({
  search,
  filters,
  limit = 100,
}: {
  search: string;
  filters: z.infer<typeof searchMetierSchema.querystring>;
  limit?: number;
}) => {
  const cleanSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const formations = await kdb
    .selectFrom("metier")
    .leftJoin("rome", "rome.codeRome", "metier.codeRome")
    .$call((q) => {
      if (filters.codeDomaineProfessionnel) {
        return q.where(
          "rome.codeDomaineProfessionnel",
          "=",
          filters.codeDomaineProfessionnel
        );
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
