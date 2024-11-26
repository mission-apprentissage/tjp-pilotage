// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { z } from "zod";

import { findMetierQuery } from "./dependencies/findMetier.query";
import type { searchMetierSchema } from "./searchMetier.schema";

type Option = z.infer<(typeof searchMetierSchema.response)[200]>[number];

export const [searchMetier] = inject(
  { findMetierQuery },
  (deps) =>
    async ({ search, filters }: { search: string; filters: z.infer<typeof searchMetierSchema.querystring> }) => {
      const formations = await deps.findMetierQuery({
        search,
        filters,
      });

      const options: Array<Option> = [];

      for (const formation of formations) {
        options.push({
          value: formation.codeMetier,
          label: formation.libelleMetier ?? "",
        });
      }

      return options;
    }
);
