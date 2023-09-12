import { inject } from "injecti";

import { findManyInDataEtablissementsQuery } from "./findManyInDataEtablissementQuery.dep";

export const [searchEtab] = inject(
  { findManyInDataEtablissementsQuery },
  (deps) =>
    async ({ search }: { search: string }) => {
      const etablissements = await deps.findManyInDataEtablissementsQuery({
        search,
      });
      const suggestions = etablissements.map((etablissement) => ({
        value: etablissement.uai,
        label:
          etablissement.libelle &&
          etablissement.commune &&
          `${etablissement.libelle} - ${etablissement.commune}`,
        commune: etablissement.commune,
      }));
      return suggestions;
    }
);
