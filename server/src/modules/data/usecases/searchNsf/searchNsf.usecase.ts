import { inject } from "injecti";

import { findNsfQuery } from "./dependencies/findNsf.query";

export const [searchNsfUsecase] = inject(
  { findNsfQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const nsf = await deps.findNsfQuery({
        search,
      });
      return nsf;
    }
);
