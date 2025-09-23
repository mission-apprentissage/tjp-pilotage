import { inject } from "@/utils/inject";

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
