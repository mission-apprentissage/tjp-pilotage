// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { hasRole } from "shared";

import type { RequestUser } from "@/modules/core/model/User";

import { searchEtablissementPerdirQuery } from "./searchEtablissementPerdir.query";

export const [searchEtablissementPerdirUsecase] = inject(
  { searchEtablissementPerdirQuery },
  (deps) =>
    async ({ search, filtered, user }: { search?: string; filtered?: boolean; user?: RequestUser }) => {
      const etablissements = await deps.searchEtablissementPerdirQuery({
        search,
        filtered,
        codeRegion: user?.codeRegion,
        uais: hasRole({ user, role: "perdir" }) ? user?.uais : undefined,
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
    },
);
