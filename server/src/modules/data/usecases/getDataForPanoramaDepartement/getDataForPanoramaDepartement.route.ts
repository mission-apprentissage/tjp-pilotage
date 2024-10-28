import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getDataForPanoramaDepartementSchema } from "./getDataForPanoramaDepartement.schema";
import { getDataForPanoramaDepartement } from "./getDataForPanoramaDepartement.usecase";

export const getDataForPanoramaDepartementRoute = (server: Server) => {
  return createRoute("/panorama/stats/departement", {
    method: "GET",
    schema: getDataForPanoramaDepartementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const stats = await getDataForPanoramaDepartement({
          ...filters,
        });
        response.status(200).send(stats);
      },
    });
  });
};
