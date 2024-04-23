import { inject } from "injecti";

import { searchDiplomeQuery } from "./searchDiplome.query";

export const [searchDiplome] = inject(
  { searchDiplomeQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const formations = await deps.searchDiplomeQuery({ search });
      return formations;
    }
);
