import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getFormationIndicateursSchema } from "./getFormationIndicateurs.schema";
import { getFormationIndicateursUseCase } from "./getFormationIndicateurs.usecase";

export const getFormationIndicateursRoute = (server: Server) => {
  return createRoute("/formation/:cfd/indicateurs", {
    method: "GET",
    schema: getFormationIndicateursSchema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { cfd } = request.params;
        const result = await getFormationIndicateursUseCase(cfd, request.query);
        response.status(200).send(result);
      },
    })
  );
};
