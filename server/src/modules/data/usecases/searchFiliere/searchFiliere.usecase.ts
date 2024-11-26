// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import { searchFiliereQuery } from "./searchFiliere.query";

export const [searchFiliereUsecase] = inject(
  { searchFiliereQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const disciplines = await deps.searchFiliereQuery({
        search,
      });
      return disciplines;
    }
);
