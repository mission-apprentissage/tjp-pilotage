import type { getFormationEtablissementsSchema } from "shared/routes/schemas/get.etablissements.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";

import { getFiltersQuery } from "./deps/getFiltersQuery.dep";
import { getFormationEtablissementsQuery } from "./deps/getFormationEtablissementsQuery.dep";
import {getFormationsRenoveesEnseigneesQuery} from './deps/getFormationsRenoveesEnseigneesQuery.dep';

export interface Filters extends z.infer<typeof getFormationEtablissementsSchema.querystring> {
  user?: RequestUser
}

// Cette fonction permet de récupérer parmis les formations rénovées d'un établissement
// (sous forme "cfd1, cfd2, cfd3") celles qui sont enseignées pour la rentrée scolaire considérée.
const getFormationsRenoveeEnseignees = (
  formationRenovee: string | undefined,
  formationsRenoveesEnseignees: string[]
) => formationRenovee?.split(", ").map((formation) => {
  return formationsRenoveesEnseignees.includes(formation);
}).join(", ");

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
          formationRenovee:
            getFormationsRenoveeEnseignees(etablissement.formationRenovee, formationsRenoveesEnseignees),
        })),
      };
    };

export const getFormationEtablissements = getFormationEtablissementsFactory();
