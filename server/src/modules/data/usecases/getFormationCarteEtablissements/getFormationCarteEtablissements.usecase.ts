import * as Boom from "@hapi/boom";
import type { Params, QueryFilters } from "shared/routes/schemas/get.formation.cfd.map.schema";

import { getBoundaries, getEtablissements, getFormation } from "./dependencies";

const getFormationCarteEtablissementsFactory =
  (
    deps = {
      getFormation,
      getEtablissements,
      getBoundaries,
    }
  ) =>
    async ({ cfd }: Params, { codeAcademie, codeRegion, codeDepartement, orderBy, includeAll, voie }: QueryFilters) => {
      const [formation, etablissements, bbox] = await Promise.all([
        deps.getFormation({ cfd }),
        deps.getEtablissements({
          cfd,
          codeAcademie,
          codeRegion,
          codeDepartement,
          orderBy,
          includeAll,
          voie
        }),
        deps.getBoundaries({ codeAcademie, codeRegion, codeDepartement }),
      ]);

      if (!formation) {
        throw Boom.notFound(`La formation avec le cfd ${cfd} est inconnue`);
      }

      return {
        etablissements,
        bbox,
      };
    };

export const getFormationCarteEtablissementsUsecase = getFormationCarteEtablissementsFactory();
