import { getStatsSortieParRegions } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

export const getDataForPanoramaEtablissementFactory =
  (
    deps = {
      getFormationsEtablissement: dependencies.getFormationsEtablissement,
      getStatsEtablissement: dependencies.getStatsEtablissement,
      getStatsSortieParRegions: getStatsSortieParRegions,
      getPositionQuadrant,
    }
  ) =>
  async (activeFilters: {
    uai: string;
    orderBy?: { column: string; order: "asc" | "desc" };
  }) => {
    const [formationsEtablissement, statsEtablissement, statsSortie] =
      await Promise.all([
        deps.getFormationsEtablissement(activeFilters),
        deps.getStatsEtablissement(activeFilters),
        deps.getStatsSortieParRegions({}),
      ]);

    return {
      ...statsEtablissement,
      formations: formationsEtablissement?.map((formation) => ({
        ...formation,
        positionQuadrant: deps.getPositionQuadrant(
          formation,
          statsSortie[statsEtablissement.codeRegion ?? ""] || {}
        ),
      })),
    };
  };

export const getDataForPanoramaEtablissement =
  getDataForPanoramaEtablissementFactory();
