import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getDomainesDeFormationSchema } from "./getDomainesDeFormation.schema";
import { getDomainesDeFormation } from "./getDomainesDeFormation.usecase";

export const getDomainesDeFormationRoute = (server: Server) => {
  return createRoute("/domaine-de-formation", {
    method: "GET",
    schema: getDomainesDeFormationSchema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.query;
        const result = await getDomainesDeFormation(search);
        response.status(200).send(result);
      },
    })
  );
};
