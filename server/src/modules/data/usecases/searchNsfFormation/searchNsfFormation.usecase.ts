import { inject } from "injecti";
import _ from "lodash";
import { z } from "zod";

import { findManyInDataFormationQuery } from "./dependencies/findDataFormations.query";
import { searchNsfFormationSchema } from "./searchNsfFormation.schema";

type Option = z.infer<(typeof searchNsfFormationSchema.response)[200]>[number];
type Formation = {
  cfd: string;
  libelleFormation: string;
  libelleNiveauDiplome: string | undefined;
};

const getFormationLabel = (formation: Formation) =>
  `${formation.libelleFormation} (${formation.libelleNiveauDiplome})`;

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

      // Déduplication des formations avec le même label
      const filteredDup = _.uniqWith(formations, (formation1, formation2) => {
        return getFormationLabel(formation1) === getFormationLabel(formation2);
      });

      for (const formation of filteredDup) {
        options.push({
          label: getFormationLabel(formation),
          value: formation.cfd,
        });
      }

      return options;
    }
);
