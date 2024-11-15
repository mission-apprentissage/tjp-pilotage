import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getFormationsPilotageIntentionsSchema } from "./getFormationsPilotageIntentions.schema";
import { getFormationsPilotageIntentionsUsecase } from "./getFormationsPilotageIntentions.usecase";

export const getFormationsPilotageIntentionsRoute = (server: Server) => {
  return createRoute("/pilotage-intentions/formations", {
    method: "GET",
    schema: getFormationsPilotageIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const stats = await getFormationsPilotageIntentionsUsecase({
          ...filters,
        });
        response.status(200).send(stats);
      },
    });
  });
};
