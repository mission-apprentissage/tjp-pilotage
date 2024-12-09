// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import { searchCampusQuery } from "./searchCampus.query";

export const [searchCampusUsecase] = inject({ searchCampusQuery }, (deps) => async ({ search }: { search: string }) => {
  const disciplines = await deps.searchCampusQuery({
    search,
  });
  return disciplines;
});
