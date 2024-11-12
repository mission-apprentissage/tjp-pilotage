import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { submitIntentionSchema } from "./submitIntention.schema";
import { submitIntentionUsecase } from "./submitIntention.usecase";

export const submitIntentionRoute = (server: Server) => {
  return createRoute("/intention/submit", {
    method: "POST",
    schema: submitIntentionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/ecriture"),
      handler: async (request, response) => {
        const { intention } = request.body;
        if (!request.user) throw Boom.unauthorized();

        const result = await submitIntentionUsecase({
          intention,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
