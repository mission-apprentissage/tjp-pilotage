// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { searchDiplomeSchema } from "shared/routes/schemas/get.diplome.search.search.schema";
import type { z } from "zod";

import { findManyInDataFormationQuery } from "./searchDiplome.query";

export const [searchDiplome] = inject(
  { findManyInDataFormationQuery },
  (deps) =>
    async ({ search, filters }: { search: string; filters: z.infer<typeof searchDiplomeSchema.querystring> }) => {
      const formations = await deps.findManyInDataFormationQuery({
        search,
        filters,
      });

      return formations;
    }
);
