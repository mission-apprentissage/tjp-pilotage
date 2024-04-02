import { dependencies, Filters } from "./dependencies";

const countRestitutionIntentionsStatsFactory =
  ({
    countRestitutionIntentionsStatsInDB = dependencies.countRestitutionIntentionsStatsInDB,
  }) =>
  async (activeFilters: Filters) => {
    const countStatsDemandesPromise =
      countRestitutionIntentionsStatsInDB(activeFilters);

    return await countStatsDemandesPromise;
  };

export const countRestitutionIntentionsStats =
  countRestitutionIntentionsStatsFactory({});
