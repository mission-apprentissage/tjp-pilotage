import { inject } from "injecti";

import { findFormationQuery } from "./findFormation.dep";

export const [checkCfd] = inject(
  { findFormationQuery },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      if (cfd.length !== 8) {
        return { status: "wrong_format" as const };
      }
      const formation = await deps.findFormationQuery({ cfd });
      if (formation) {
        return {
          status: "valid" as const,
          data: {
            cfd: formation.codeFormationDiplome,
            libelle: formation.libelleDiplome,
            dispositifs: formation.dispositifs,
          },
        };
      }
      return { status: "not_found" as const };
    }
);
