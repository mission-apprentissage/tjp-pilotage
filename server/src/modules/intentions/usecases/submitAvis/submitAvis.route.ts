import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { submitAvisSchema } from "./submitAvis.schema";
import { submitAvisUsecase } from "./submitAvis.usecase";

export const submitAvisRoute = (server: Server) => {
  return createRoute("/intention/avis/submit", {
    method: "POST",
    schema: submitAvisSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir-avis/ecriture"),
      handler: async (request, response) => {
        const { avis } = request.body;

        const result = await submitAvisUsecase({
          user: request.user!,
          avis,
        });
        response.status(200).send(result);
      },
    });
  });
};
