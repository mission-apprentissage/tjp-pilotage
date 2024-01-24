import { getStatsSortieParNiveauDiplome } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

const getFormationsFactory =
  (
    deps = {
      findFormationsInDb: dependencies.findFormationsInDb,
      findFiltersInDb: dependencies.findFiltersInDb,
    }
  ) =>
  async (activeFilters: {
    offset?: number;
    limit?: number;
    codeRegion?: string[];
    codeAcademie?: string[];
    codeDepartement?: string[];
    codeDiplome?: string[];
    codeDispositif?: string[];
    commune?: string[];
    cfd?: string[];
    rentreeScolaire?: string[];
    cfdFamille?: string[];
    cpc?: string[];
    cpcSecteur?: string[];
    cpcSousSecteur?: string[];
    libelleFiliere?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
    withEmptyFormations?: boolean;
    withAnneeCommune?: string;
    positionQuadrant?: string;
  }) => {
    const [{ formations, count }, filters, statsSortie] = await Promise.all([
      deps.findFormationsInDb(activeFilters),
      deps.findFiltersInDb(activeFilters),
      getStatsSortieParNiveauDiplome(activeFilters),
    ]);

    return {
      count,
      filters,
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: getPositionQuadrant(
          formation,
          statsSortie[formation.codeNiveauDiplome ?? ""] ?? {}
        ),
      })),
    };
  };

export const getFormations = getFormationsFactory();
