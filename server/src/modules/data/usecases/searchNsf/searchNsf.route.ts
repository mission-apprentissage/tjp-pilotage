import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { searchNsfSchema } from "./searchNsf.schema";
import { searchNsfUsecase } from "./searchNsf.usecase";

export const searchNsfRoute = ({ server }: { server: Server }) => {
  return createRoute("/nsf/search/:search", {
    method: "GET",
    schema: searchNsfSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchNsfUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
