import type { MILLESIMES_IJ } from "shared";
import type { getFormationEtablissementsSchema } from "shared/routes/schemas/get.etablissements.schema";
import type { z } from "zod";

import { getFormationsRenoveesEnseigneesQuery } from "@/modules/data/queries/getFormationsRenovees/getFormationsRenovees";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";

import { getFiltersQuery } from "./deps/getFiltersQuery.dep";
import { getFormationEtablissementsQuery } from "./deps/getFormationEtablissementsQuery.dep";

export interface Filters extends z.infer<typeof getFormationEtablissementsSchema.querystring> {
  millesimeSortie: (typeof MILLESIMES_IJ)[number];
}

const getFormationEtablissementsFactory =
  (
    deps = {
      getFormationEtablissementsQuery,
      getFiltersQuery,
      getFormationsRenoveesEnseigneesQuery,
      getStatsSortieParRegionsEtNiveauDiplomeQuery,
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
