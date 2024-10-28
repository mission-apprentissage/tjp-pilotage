import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getRepartitionPilotageIntentionsSchema } from "./getRepartitionPilotageIntentions.schema";
import { getRepartitionPilotageIntentionsUsecase } from "./getRepartitionPilotageIntentions.usecase";

export const getRepartitionPilotageIntentionsRoute = (server: Server) => {
  return createRoute("/pilotage-intentions/repartition", {
    method: "GET",
    schema: getRepartitionPilotageIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;

        const result = await getRepartitionPilotageIntentionsUsecase(filters);
        response.status(200).send(result);
      },
    });
  });
};
