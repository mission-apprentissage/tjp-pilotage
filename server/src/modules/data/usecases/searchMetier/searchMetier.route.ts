import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { searchMetierSchema } from "./searchMetier.schema";
import { searchMetier } from "./searchMetier.usecase";

export const searchMetierRoute = ({ server }: { server: Server }) => {
  return createRoute("/metier/search/:search", {
    method: "GET",
    schema: searchMetierSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const filters = request.query;
        const result = await searchMetier({ search, filters });
        response.status(200).send(result);
      },
    });
  });
};
