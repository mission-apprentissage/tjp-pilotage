import { inject } from "injecti";
import { hasRole } from "shared";

import { RequestUser } from "../../../core/model/User";
import { findManyInDataEtablissementsQuery } from "./findManyInDataEtablissementQuery.dep";

export const [searchEtablissementPerdirUsecase] = inject(
  { findManyInDataEtablissementsQuery },
  (deps) =>
    async ({
      search,
      filtered,
      user,
    }: {
      search?: string;
      filtered?: boolean;
      user?: RequestUser;
    }) => {
      const etablissements = await deps.findManyInDataEtablissementsQuery({
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
    }
);
