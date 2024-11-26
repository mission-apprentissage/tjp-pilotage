import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { searchCampusSchema } from "./searchCampus.schema";
import { searchCampusUsecase } from "./searchCampus.usecase";

export const searchCampusRoute = (server: Server) => {
  return createRoute("/campus/search/:search", {
    method: "GET",
    schema: searchCampusSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchCampusUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
