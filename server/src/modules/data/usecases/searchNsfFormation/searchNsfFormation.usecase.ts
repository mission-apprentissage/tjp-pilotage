import { inject } from "injecti";
import { z } from "zod";

import { findManyInDataFormationQuery } from "./findManyInDataFormationQuery.dep";
import { searchNsfFormationSchema } from "./searchNsfFormation.schema";

type Option = z.infer<(typeof searchNsfFormationSchema.response)[200]>[number];

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

      const options: Array<Option> = [];

      for (const formation of formations) {
        options.push({
          label: `${formation.libelleFormation} (${formation.libelleNiveauDiplome})`,
          value: formation.cfd,
        });
      }

      return options;
    }
);
