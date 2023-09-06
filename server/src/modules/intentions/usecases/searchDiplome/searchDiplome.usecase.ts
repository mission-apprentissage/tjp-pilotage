import { inject } from "injecti";

import { findManyInFormationQuery } from "./findManyInFormationQuery.dep";

export const [searchDiplome] = inject(
  { findManyInFormationQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const formations = await deps.findManyInFormationQuery({ search });
      return formations;
    }
);
