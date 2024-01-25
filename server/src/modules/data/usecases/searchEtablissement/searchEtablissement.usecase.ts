import { inject } from "injecti";

import { findManyInDataEtablissementsQuery } from "./findManyInDataEtablissementQuery.dep";

export const [searchEtablissement] = inject(
  { findManyInDataEtablissementsQuery },
  (deps) =>
    async ({
      search,
      filtered,
      user,
    }: {
      search: string;
      filtered?: boolean;
      user?: { codeRegion?: string };
    }) => {
      const etablissements = await deps.findManyInDataEtablissementsQuery({
        search,
        filtered,
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
