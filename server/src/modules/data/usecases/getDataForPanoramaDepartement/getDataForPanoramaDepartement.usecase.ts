
import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from '../../services/getPositionQuadrant';
import { dependencies } from "./dependencies";

export const getDataForPanoramaDepartementFactory = (
  deps = {
    getFormationsDepartement: dependencies.getFormationsDepartement,
    getFilters: dependencies.getFilters,
  }
) =>
  async (activeFilters: {
    codeDepartement: string;
    codeNiveauDiplome?: string[];
    libelleFiliere?: string[];
    orderBy?: { column: string; order: "asc" | "desc" };
  }) => {
    const [formations, { diplomes, filieres }, statsSortie] =
      await Promise.all([
        deps.getFormationsDepartement(activeFilters),
        deps.getFilters(activeFilters),
        getStatsSortie(activeFilters),
      ]);

    return {
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: getPositionQuadrant(formation, statsSortie),
      })),
      filters: {
        diplomes,
        filieres,
      },
    };
  };

export const getDataForPanoramaDepartement = getDataForPanoramaDepartementFactory();
