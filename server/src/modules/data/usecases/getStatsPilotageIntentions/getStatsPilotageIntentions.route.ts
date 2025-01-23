import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getStatsPilotageIntentionsUsecase } from "./getStatsPilotageIntentions.usecase";

const ROUTE = ROUTES["[GET]/pilotage-intentions/stats"];

export const getStatsPilotageIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const statsTauxTransfo = await getStatsPilotageIntentionsUsecase(request.query);
        response.status(200).send(statsTauxTransfo);
      },
    });
  });
};
