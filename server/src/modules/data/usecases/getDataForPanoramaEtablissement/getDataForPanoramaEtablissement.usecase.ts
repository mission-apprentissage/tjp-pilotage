import { getStatsSortieParRegionsQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "@/modules/data/services/getPositionQuadrant";

import { dependencies } from "./dependencies";

export const getDataForPanoramaEtablissementFactory =
  (
    deps = {
      getFormationsEtablissement: dependencies.getFormationsEtablissement,
      getStatsEtablissement: dependencies.getStatsEtablissement,
      getStatsSortieParRegionsQuery,
      getPositionQuadrant,
    }
  ) =>
  async (activeFilters: { uai: string; orderBy?: { column: string; order: "asc" | "desc" } }) => {
    const [formationsEtablissement, statsEtablissement, statsSortie] = await Promise.all([
      deps.getFormationsEtablissement(activeFilters),
      deps.getStatsEtablissement(activeFilters),
      deps.getStatsSortieParRegionsQuery({}),
    ]);

    return {
      ...statsEtablissement,
      formations: formationsEtablissement?.map((formation) => ({
        ...formation,
        positionQuadrant: deps.getPositionQuadrant(formation, statsSortie[statsEtablissement.codeRegion ?? ""] || {}),
      })),
    };
  };

export const getDataForPanoramaEtablissement = getDataForPanoramaEtablissementFactory();
