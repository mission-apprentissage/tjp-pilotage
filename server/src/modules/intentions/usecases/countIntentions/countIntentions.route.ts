import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { countIntentionsSchema } from "./countIntentions.schema";
import { countIntentionsUsecase } from "./countIntentions.usecase";

export const countIntentionsRoute = (server: Server) => {
  return createRoute("/intentions/count", {
    method: "GET",
    schema: countIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const { anneeCampagne } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await countIntentionsUsecase({
          user: request.user,
          anneeCampagne,
        });
        response.status(200).send(result);
      },
    });
  });
};
