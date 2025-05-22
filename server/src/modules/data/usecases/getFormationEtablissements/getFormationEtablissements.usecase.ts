import type { MILLESIMES_IJ } from "shared";
import type { getFormationEtablissementsSchema } from "shared/routes/schemas/get.etablissements.schema";
import type { z } from "zod";

import { getFiltersQuery } from "./deps/getFiltersQuery.dep";
import { getFormationEtablissementsQuery } from "./deps/getFormationEtablissementsQuery.dep";
import {getFormationsRenoveesEnseigneesQuery} from './deps/getFormationsRenoveesEnseigneesQuery.dep';

export interface Filters extends z.infer<typeof getFormationEtablissementsSchema.querystring> {
  millesimeSortie: (typeof MILLESIMES_IJ)[number];
}

const getFormationEtablissementsFactory =
  (
    deps = {
      getFormationEtablissementsQuery,
      getFiltersQuery,
      getFormationsRenoveesEnseigneesQuery,
    }
  ) =>
    async (activeFilters: Partial<Filters>) => {
      const [{ etablissements, count }, filters, formationsRenoveesEnseignees] = await Promise.all([
        deps.getFormationEtablissementsQuery(activeFilters),
        deps.getFiltersQuery(activeFilters),
        deps.getFormationsRenoveesEnseigneesQuery(activeFilters),
      ]);

      return {
        count,
        filters,
        etablissements: etablissements.map((etablissement) => ({
          ...etablissement,
          formationRenovee: formationsRenoveesEnseignees.includes(etablissement.formationRenovee ?? "")
            ? etablissement.formationRenovee
            : undefined,
        })),
      };
    };

export const getFormationEtablissements = getFormationEtablissementsFactory();
