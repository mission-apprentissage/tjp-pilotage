import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { searchNsfFormationSchema } from "./searchNsfFormation.schema";
import { searchDiplome } from "./searchNsfFormation.usecase";

export const searchNsfDiplomeRoute = (server: Server) => {
  return createRoute("/nsf-diplome/search/:search", {
    method: "GET",
    schema: searchNsfFormationSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const filters = request.query;
        const result = await searchDiplome({ search, filters });
        response.status(200).send(result);
      },
    });
  });
};
