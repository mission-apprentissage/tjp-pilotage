import { MILLESIMES_IJ } from "shared";
import { z } from "zod";

import { getFormationsRenoveesRentreeScolaireQuery } from "../../queries/getFormationsRenovees/getFormationsRenovees";
import { getStatsSortieParNiveauDiplomeQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getFiltersQuery } from "./deps/getFiltersQuery.dep";
import { getFormationsQuery } from "./deps/getFormationsQuery.dep";
import { getFormationSchema } from "./getFormations.schema";

export interface Filters
  extends z.infer<typeof getFormationSchema.querystring> {
  millesimeSortie: (typeof MILLESIMES_IJ)[number];
}

const getFormationsFactory =
  (
    deps = {
      getFormationsQuery,
      getFiltersQuery,
      getStatsSortieParNiveauDiplomeQuery,
      getFormationsRenoveesRentreeScolaireQuery,
    }
  ) =>
  async (activeFilters: Partial<Filters>) => {
    const [{ formations, count }, filters, formationsRenoveesEnseignees] =
      await Promise.all([
        deps.getFormationsQuery(activeFilters),
        deps.getFiltersQuery(activeFilters),
        deps.getFormationsRenoveesRentreeScolaireQuery(activeFilters),
      ]);

    return {
      count,
      filters,
      formations: formations.map((formation) => ({
        ...formation,
        formationRenovee: formationsRenoveesEnseignees.includes(
          formation.formationRenovee ?? ""
        )
          ? formation.formationRenovee
          : undefined,
      })),
    };
  };

export const getFormations = getFormationsFactory();
