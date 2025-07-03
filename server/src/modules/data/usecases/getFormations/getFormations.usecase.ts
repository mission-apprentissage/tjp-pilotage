import type { getFormationsSchema } from "shared/routes/schemas/get.formations.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";

import { getFiltersQuery } from "./deps/getFiltersQuery.dep";
import { getFormationsQuery } from "./deps/getFormationsQuery.dep";
import { getFormationsScolairesRenoveesQuery } from './deps/getFormationsScolairesRenoveesQuery.dep';

export interface Filters extends z.infer<typeof getFormationsSchema.querystring> {
  user?: RequestUser
}

const getFormationsFactory =
  (
    deps = {
      getFormationsQuery,
      getFiltersQuery,
      getFormationsScolairesRenoveesQuery,
    }
  ) =>
    async (activeFilters: Partial<Filters>) => {
      const [{ formations, count }, filters, formationsRenoveesEnseignees] = await Promise.all([
        deps.getFormationsQuery(activeFilters),
        deps.getFiltersQuery(activeFilters),
        deps.getFormationsScolairesRenoveesQuery(activeFilters),
      ]);

      return {
        count,
        filters,
        formations: formations.map((formation) => ({
          ...formation,
          formationRenovee: formationsRenoveesEnseignees.includes(formation.formationRenovee ?? "")
            ? formation.formationRenovee
            : undefined,
        })),
      };
    };

export const getFormations = getFormationsFactory();
