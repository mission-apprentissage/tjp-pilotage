// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import type { searchDiplomeSchema } from "shared/routes/schemas/get.diplome.search.search.schema";
import type { z } from "zod";

import type {RequestUser} from '@/modules/core/model/User';
import { inject } from "@/utils/inject";

import { searchDiplomeQuery } from "./searchDiplome.query";

export interface Filters extends z.infer<typeof searchDiplomeSchema.querystring> {
  search: string;
  user: RequestUser;
}

export const [searchDiplome] = inject(
  {
    searchDiplomeQuery,
  },
  (deps) =>
    async (activeFilters: Filters) => {
      const anneeCampagne = activeFilters.campagne;

      const formations = await deps.searchDiplomeQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      });
      return formations;
    }
);
