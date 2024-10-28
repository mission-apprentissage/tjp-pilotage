import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { searchDisciplineSchema } from "./searchDiscipline.schema";
import { searchDisciplineUsecase } from "./searchDiscipline.usecase";

export const searchDisciplineRoute = (server: Server) => {
  return createRoute("/discipline/search/:search", {
    method: "GET",
    schema: searchDisciplineSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchDisciplineUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
