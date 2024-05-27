import { inject } from "injecti";
import { z } from "zod";

import { findMetierQuery } from "./findMetierQuery";
import { searchMetierSchema } from "./searchMetier.schema";

export const [searchMetier] = inject(
  { findMetierQuery },
  (deps) =>
    async ({
      search,
      filters,
    }: {
      search: string;
      filters: z.infer<typeof searchMetierSchema.querystring>;
    }) => {
      const formations = await deps.findMetierQuery({
        search,
        filters,
      });
      return formations;
    }
);
