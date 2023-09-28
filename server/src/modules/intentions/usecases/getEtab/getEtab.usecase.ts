import { inject } from "injecti";

import { findOneDataEtablissement } from "../../repositories/findOneDataEtablissement.dep";

export const [getEtab] = inject(
  { findOneDataEtablissement },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const etablissement = await deps.findOneDataEtablissement({
        uai,
      });

      return {
        value: etablissement?.uai ?? uai,
        label:
          etablissement?.libelle &&
          etablissement?.commune &&
          `${etablissement.libelle} - ${etablissement.commune}`,
        commune: etablissement?.commune,
      };
    }
);