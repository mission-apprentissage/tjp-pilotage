import Boom from "@hapi/boom";

import { getEtablissements, getFormation, getInitialZoom } from "./dependencies";
import type { Params, QueryFilters } from "./getFormationCarteEtablissements.schema";

const getFormationCarteEtablissementsFactory =
  (
    deps = {
      getFormation,
      getEtablissements,
      getInitialZoom,
    }
  ) =>
  async (
    { cfd }: Params,
    { codeAcademie, codeRegion, codeDepartement, mapHeight, mapWidth, orderBy }: QueryFilters
  ) => {
    const [formation, etablissements] = await Promise.all([
      deps.getFormation({ cfd }),
      deps.getEtablissements({
        cfd,
        codeAcademie,
        codeRegion,
        codeDepartement,
        orderBy,
      }),
    ]);

    if (!formation) {
      throw Boom.notFound(`La formation avec le cfd ${cfd} est inconnue`);
    }

    const { bbox, zoom } = getInitialZoom({
      etablissements,
      mapDimensions: {
        height: mapHeight,
        width: mapWidth,
      },
    });

    return {
      etablissements,
      bbox,
      zoom,
    };
  };

export const getFormationCarteEtablissementsUsecase = getFormationCarteEtablissementsFactory();
