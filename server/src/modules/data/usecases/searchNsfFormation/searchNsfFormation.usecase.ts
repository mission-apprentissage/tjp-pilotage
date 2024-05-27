import { inject } from "injecti";
import { z } from "zod";

import { findManyInDataFormationQuery } from "./findManyInDataFormationQuery.dep";
import { searchNsfFormationSchema } from "./searchNsfFormation.schema";

export const [searchDiplome] = inject(
  { findManyInDataFormationQuery },
  (deps) =>
    async ({
      search,
      filters,
    }: {
      search: string;
      filters: z.infer<typeof searchNsfFormationSchema.querystring>;
    }) => {
      const formations = await deps.findManyInDataFormationQuery({
        search,
        filters,
      });
      return formations;
    }
);
