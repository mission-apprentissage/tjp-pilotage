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
        const { user } = request;
        const result = await countIntentionsUsecase({
          user: user!,
          anneeCampagne,
        });
        response.status(200).send(result);
      },
    });
  });
};
