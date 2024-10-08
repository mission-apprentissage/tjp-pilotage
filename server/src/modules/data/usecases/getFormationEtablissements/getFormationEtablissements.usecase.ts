import { MILLESIMES_IJ } from "shared";
import { z } from "zod";

import { getFormationsRenoveesEnseigneesQuery } from "../../queries/getFormationsRenovees/getFormationsRenovees";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getFiltersQuery } from "./deps/getFiltersQuery.dep";
import { getFormationEtablissementsQuery } from "./deps/getFormationEtablissementsQuery.dep";
import { getFormationEtablissementsSchema } from "./getFormationEtablissements.schema";

export interface Filters
  extends z.infer<typeof getFormationEtablissementsSchema.querystring> {
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
    const [{ etablissements, count }, filters, formationsRenoveesEnseignees] =
      await Promise.all([
        deps.getFormationEtablissementsQuery(activeFilters),
        deps.getFiltersQuery(activeFilters),
        deps.getFormationsRenoveesEnseigneesQuery(activeFilters),
      ]);

    return {
      count,
      filters,
      etablissements: etablissements.map((etablissement) => ({
        ...etablissement,
        formationRenovee: formationsRenoveesEnseignees.includes(
          etablissement.formationRenovee ?? ""
        )
          ? etablissement.formationRenovee
          : undefined,
      })),
    };
  };

export const getFormationEtablissements = getFormationEtablissementsFactory();
