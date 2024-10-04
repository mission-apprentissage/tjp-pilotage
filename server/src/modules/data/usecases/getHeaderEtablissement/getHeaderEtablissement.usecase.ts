import Boom from "@hapi/boom";
import { inject } from "injecti";

import {
  getEtablissement,
  getIndicateurs,
  getInformations,
  getNsfs,
} from "./dependencies";
import { GetHeaderEtablissementType } from "./getHeaderEtablissement.schema";

export const [getHeaderEtablissement] = inject(
  {
    getInformations,
    getNsfs,
    getEtablissement,
    getIndicateurs,
  },
  (deps) =>
    async ({ uai }: { uai: string }): Promise<GetHeaderEtablissementType> => {
      const [etablissementId, informations, nsfs, indicateurs] =
        await Promise.all([
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
