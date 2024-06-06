import { inject } from "injecti";

import { searchDisciplineQuery } from "./searchDiscipline.query";

export const [searchDisciplineUsecase] = inject(
  { searchDisciplineQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const disciplines = await deps.searchDisciplineQuery({
        search,
      });
      return disciplines;
    }
);
