import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getStatsPilotageIntentionsSchema } from "./getStatsPilotageIntentions.schema";
import { getStatsPilotageIntentionsUsecase } from "./getStatsPilotageIntentions.usecase";

export const getStatsPilotageIntentionsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/pilotage-intentions/stats", {
    method: "GET",
    schema: getStatsPilotageIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const statsTauxTransfo = await getStatsPilotageIntentionsUsecase(
          request.query
        );
        response.status(200).send(statsTauxTransfo);
      },
    });
  });
};
