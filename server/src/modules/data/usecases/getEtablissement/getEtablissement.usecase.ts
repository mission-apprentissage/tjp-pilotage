import Boom from "@hapi/boom";
import { inject } from "injecti";

import { findOneDataEtablissement } from "../../repositories/findOneDataEtablissement.query";

export const [getEtablissement] = inject(
  { findOneDataEtablissement },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const etablissement = await deps.findOneDataEtablissement({
        uai,
      });

      if (!etablissement) {
        throw Boom.notFound(
          `L'établissement avec l'uai ${uai} n'existe pas dans l'application.`
        );
      }

      return {
        value: etablissement?.uai ?? uai,
        label:
          etablissement?.libelleEtablissement &&
          etablissement?.commune &&
          `${etablissement.libelleEtablissement} - ${etablissement.commune}`,
        commune: etablissement?.commune,
      };
    }
);
