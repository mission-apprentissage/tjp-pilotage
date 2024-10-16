import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getDomaineDeFormationSchema } from "./getDomaineDeFormation.schema";
import { getDomaineDeFormation } from "./getDomaineDeFormation.usecase";

export const getDomaineDeFormationRoute = (server: Server) => {
  return createRoute("/domaine-de-formation/:codeNsf", {
    method: "GET",
    schema: getDomaineDeFormationSchema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { codeNsf } = request.params;
        const result = await getDomaineDeFormation(codeNsf, request.query);
        response.status(200).send(result);
      },
    })
  );
};
