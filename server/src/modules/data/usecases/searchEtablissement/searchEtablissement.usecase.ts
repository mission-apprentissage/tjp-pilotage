// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { searchEtablissementQuery } from "./searchEtablissement.query";

export const [searchEtablissement] = inject(
  { searchEtablissementQuery },
  (deps) =>
    async ({ search, filtered, user }: { search: string; filtered?: boolean; user?: { codeRegion?: string } }) => {
      const etablissements = await deps.searchEtablissementQuery({
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
