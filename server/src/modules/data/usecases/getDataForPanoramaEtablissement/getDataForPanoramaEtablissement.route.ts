import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getEtablissementSchema } from "./getDataForPanoramaEtablissement.schema";
import { getDataForPanoramaEtablissement } from "./getDataForPanoramaEtablissement.usecase";

export const getDataForPanoramaEtablissementRoute = (server: Server) => {
  return createRoute("/panorama/stats/etablissement/:uai", {
    method: "GET",
    schema: getEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { order, orderBy, ...filters } = request.query;
        const etablissement = await getDataForPanoramaEtablissement({
          ...filters,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        if (!etablissement) return response.status(404).send();
        response.status(200).send(etablissement);
      },
    });
  });
};
