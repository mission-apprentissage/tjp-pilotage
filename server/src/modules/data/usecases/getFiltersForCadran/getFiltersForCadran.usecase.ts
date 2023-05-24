import { inject } from "injecti";

import { findFiltersInDb } from "./dependencies";

export const [getFiltersForCadran] = inject(
  { findFiltersInDb },
  (deps) =>
    async ({ codeRegion }: { codeRegion?: string }) => {
      const filters = await deps.findFiltersInDb({ codeRegion });
      return { filters };
    }
);
