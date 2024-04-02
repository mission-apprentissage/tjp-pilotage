import { dependencies, Filters } from "./dependencies";

const getStatsRestitutionIntentionsFactory =
  ({
    getStatsRestitutionIntentionsQuery = dependencies.getStatsRestitutionIntentionsQuery,
  }) =>
  async (activeFilters: Filters) => {
    const countRestitutionIntentions =
      getStatsRestitutionIntentionsQuery(activeFilters);

    return await countRestitutionIntentions;
  };

export const getStatsRestitutionIntentionsUsecase =
  getStatsRestitutionIntentionsFactory({});
