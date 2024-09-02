import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getRepartitionPilotageIntentionsSchema } from "./getRepartitionPilotageIntentions.schema";
import { getRepartitionPilotageIntentionsUsecase } from "./getRepartitionPilotageIntentions.usecase";

export const getRepartitionPilotageIntentionsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/pilotage-intentions/repartition", {
    method: "GET",
    schema: getRepartitionPilotageIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getRepartitionPilotageIntentionsUsecase({
          ...filters,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
