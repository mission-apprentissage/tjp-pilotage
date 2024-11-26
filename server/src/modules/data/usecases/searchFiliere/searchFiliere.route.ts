import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { searchFiliereSchema } from "./searchFiliere.schema";
import { searchFiliereUsecase } from "./searchFiliere.usecase";

export const searchFiliereRoute = (server: Server) => {
  return createRoute("/filiere/search/:search", {
    method: "GET",
    schema: searchFiliereSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchFiliereUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
