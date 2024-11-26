import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { searchDiplomeSchema } from "./searchDiplome.schema";
import { searchDiplome } from "./searchDiplome.usecase";

export const searchDiplomeRoute = (server: Server) => {
  return createRoute("/diplome/search/:search", {
    method: "GET",
    schema: searchDiplomeSchema,
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
