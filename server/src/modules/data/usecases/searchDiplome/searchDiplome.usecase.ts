import { inject } from "injecti";
import { z } from "zod";

import { findManyInDataFormationQuery } from "./searchDiplome.query";
import { searchDiplomeSchema } from "./searchDiplome.schema";

export const [searchDiplome] = inject(
  { findManyInDataFormationQuery },
  (deps) =>
    async ({
      search,
      filters,
    }: {
      search: string;
      filters: z.infer<typeof searchDiplomeSchema.querystring>;
    }) => {
      const formations = await deps.findManyInDataFormationQuery({
        search,
        filters,
      });

      return formations;
    }
);
