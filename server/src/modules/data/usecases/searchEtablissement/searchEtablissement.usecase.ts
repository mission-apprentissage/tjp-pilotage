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
          etablissement.libelle &&
          etablissement.commune &&
          `${etablissement.libelle} - ${etablissement.commune}`,
        commune: etablissement.commune,
      }));
      return suggestions;
    }
);
