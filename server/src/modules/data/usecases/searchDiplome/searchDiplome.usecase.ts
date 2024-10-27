// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { z } from "zod";

import { findManyInDataFormationQuery } from "./searchDiplome.query";
import type { searchDiplomeSchema } from "./searchDiplome.schema";

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
