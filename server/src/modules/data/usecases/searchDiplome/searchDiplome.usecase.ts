import { inject } from "injecti";

import { findManyInDataFormationQuery } from "./findManyInDataFormationQuery.dep";

export const [searchDiplome] = inject(
  { findManyInDataFormationQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const formations = await deps.findManyInDataFormationQuery({ search });
      return formations;
    }
);
