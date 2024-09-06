import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import {
  dependencies,
  Filters,
  getCodeRegionFromAcademie,
  getCodeRegionFromDepartement,
} from "./dependencies";

const getQuadrantPilotageIntentionsFactory =
  (
    deps = {
      getFormationsPilotageIntentionsQuery:
        dependencies.getFormationsPilotageIntentionsQuery,
      getStatsSortieQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.campagne ?? campagne.annee;
    let codeRegion = activeFilters.codeRegion;

    if (!codeRegion && activeFilters.codeDepartement) {
      const { codeRegion: departementCodeRegion } =
        await getCodeRegionFromDepartement(activeFilters.codeDepartement);
      if (departementCodeRegion) {
        codeRegion = departementCodeRegion;
      }
    }

    if (!codeRegion && activeFilters.codeAcademie) {
      const { codeRegion: academieCodeRegion } =
        await getCodeRegionFromAcademie(activeFilters.codeAcademie);
      if (academieCodeRegion) {
        codeRegion = academieCodeRegion;
      }
    }

    const [formations, statsSortie] = await Promise.all([
      deps.getFormationsPilotageIntentionsQuery({
        campagne: anneeCampagne,
        ...activeFilters,
        codeRegion,
      }),
      getStatsSortieQuery({ ...activeFilters, codeRegion }),
    ]);

    return {
      stats: statsSortie,
      formations: formations.map((formation) => ({
        ...formation,
      })),
    };
  };
export const getFormationsPilotageIntentionsUsecase =
  getQuadrantPilotageIntentionsFactory();
