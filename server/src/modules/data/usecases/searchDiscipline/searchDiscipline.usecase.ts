import { inject } from "injecti";

import { findManyInDisciplineQuery } from "./findManyInDisciplineQuery";

export const [searchDisciplineUsecase] = inject(
  { findManyInDisciplineQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const disciplines = await deps.findManyInDisciplineQuery({
        search,
      });
      return disciplines;
    }
);
