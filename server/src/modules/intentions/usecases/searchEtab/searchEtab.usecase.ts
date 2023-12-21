import { inject } from "injecti";

import { findManyInDataEtablissementsQuery } from "./findManyInDataEtablissementQuery.dep";

export const [searchEtab] = inject(
  { findManyInDataEtablissementsQuery },
  (deps) =>
    async ({
      search,
      user,
    }: {
      search: string;
      user?: { codeRegion?: string };
    }) => {
      const etablissements = await deps.findManyInDataEtablissementsQuery({
        search,
        codeRegion: user?.codeRegion,
      });
      const suggestions = etablissements.map((etablissement) => ({
        value: etablissement.uai,
        label:
          etablissement.libelleEtablissement &&
          etablissement.commune &&
          `${etablissement.libelleEtablissement} - ${etablissement.commune}`,
        commune: etablissement.commune,
      }));
      return suggestions;
    }
);
