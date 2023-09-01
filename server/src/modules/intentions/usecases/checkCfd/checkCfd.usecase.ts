import { inject } from "injecti";

import { findFormationFromRawDataQuery } from "./findFormation.dep";

export const [checkCfd] = inject(
  { findFormationFromRawDataQuery },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      const formation = await deps.findFormationFromRawDataQuery({ cfd });
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
    }
);
