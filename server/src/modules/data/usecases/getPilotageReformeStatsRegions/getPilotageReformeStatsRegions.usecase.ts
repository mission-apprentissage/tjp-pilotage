import * as dependencies from "./deps";

const getPilotageReformeStatsRegionsFactory =
  (
    deps = {
      getStatsRegions: dependencies.getStatsRegions,
      getFilters: dependencies.getFilters,
      getRentreesScolaire: dependencies.getRentreesScolaire,
    }
  ) =>
    async (activeFilters: { codeNiveauDiplome?: string; orderBy?: { order: "asc" | "desc"; column: string } }) => {
      const rentreesScolaire = await deps.getRentreesScolaire();

      const [statsRegions, filters] = await Promise.all([
        deps.getStatsRegions({ ...activeFilters, rentreesScolaire }),
        deps.getFilters(),
      ]);

      return {
        statsRegions,
        filters,
        rentreesScolaire
      };
    };

export const getPilotageReformeStatsRegions = getPilotageReformeStatsRegionsFactory();
