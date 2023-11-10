import { inject } from "injecti";

import { cleanNull } from "../../../../utils/noNull";
import { dependencies } from "./dependencies";

export const [getEtablissement] = inject(
  { getEtablissementInD: dependencies.getEtablissementInDb },
  (deps) =>
    async (
      {
        uai,
        orderBy
      }: {
        uai: string;
        orderBy?: { column: string; order: "asc" | "desc" };
      }) => {
      const etablissement = await deps.getEtablissementInD({
        uai,
        orderBy
      });

      return (
        etablissement &&
        cleanNull({
          ...etablissement,
          formations: etablissement.formations.map(cleanNull),
        })
      );
    }
);
