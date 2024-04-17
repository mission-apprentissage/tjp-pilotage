import { getFormationsRenoveesRentreeScolaireQuery } from "../../queries/getFormationsRenovees/getFormationsRenovees";
import { getStatsSortieParNiveauDiplomeQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getFormationsFactory =
  (
    deps = {
      findFormationsInDb: dependencies.findFormationsInDb,
      findFiltersInDb: dependencies.findFiltersInDb,
      getStatsSortieParNiveauDiplomeQuery,
      getFormationsRenoveesRentreeScolaireQuery,
    }
  ) =>
  async (activeFilters: Partial<Filters>) => {
    const [
      { formations, count },
      filters,
      statsSortie,
      formationsRenoveesEnseignees,
    ] = await Promise.all([
      deps.findFormationsInDb(activeFilters),
      deps.findFiltersInDb(activeFilters),
      deps.getStatsSortieParNiveauDiplomeQuery(activeFilters),
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
        positionQuadrant: getPositionQuadrant(
          formation,
          statsSortie[formation.codeNiveauDiplome ?? ""] ?? {}
        ),
      })),
    };
  };

export const getFormations = getFormationsFactory();
