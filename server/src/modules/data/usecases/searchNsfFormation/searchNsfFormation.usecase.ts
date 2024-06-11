import { inject } from "injecti";
import _ from "lodash";
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

      // Dédupliquer les libellés des formations qui sont doublés
      // et garder celle qui n'a pas de date de fermeture
      const filteredDup = _.uniqBy(formations, "libelleFormation");

      for (const formation of filteredDup) {
        options.push({
          label: `${formation.libelleFormation} (${formation.libelleNiveauDiplome})`,
          value: formation.cfd,
          data: {
            voies: _.uniq(formation.voies).filter((u) => u !== undefined) ?? [],
            dateFermeture: formation.dateFermeture,
          },
        });
      }

      return options;
    }
);
