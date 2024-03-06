import { getFormationsRenoveesRentreeScolaire } from "../../queries/getFormationsRenovees/getFormationsRenovees";
import { getStatsSortieParNiveauDiplome } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getFormationsFactory =
  (
    deps = {
      findFormationsInDb: dependencies.findFormationsInDb,
      findFiltersInDb: dependencies.findFiltersInDb,
      getStatsSortieParNiveauDiplome,
      getFormationsRenoveesRentreeScolaire,
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
      deps.getStatsSortieParNiveauDiplome(activeFilters),
      deps.getFormationsRenoveesRentreeScolaire(activeFilters),
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
