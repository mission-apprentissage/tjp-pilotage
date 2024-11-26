import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { GetHeaderEtablissementType } from "shared/routes/schemas/get.etablissement.uai.header.schema";

import { getEtablissement, getIndicateurs, getInformations, getNsfs } from "./dependencies";

export const [getHeaderEtablissement] = inject(
  {
    getInformations,
    getNsfs,
    getEtablissement,
    getIndicateurs,
  },
  (deps) =>
    async ({ uai }: { uai: string }): Promise<GetHeaderEtablissementType> => {
      const [etablissementId, informations, nsfs, indicateurs] = await Promise.all([
        deps.getEtablissement({ uai }),
        deps.getInformations({ uai }),
        deps.getNsfs({ uai }),
        deps.getIndicateurs({ uai }),
      ]);

      if (!etablissementId) {
        throw Boom.notFound(`Etablissement avec l'uai ${uai} inconnu`);
      }

      return {
        informations,
        nsfs,
        indicateurs,
      };
    }
);
