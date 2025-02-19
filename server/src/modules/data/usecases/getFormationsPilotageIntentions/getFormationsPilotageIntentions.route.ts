import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getFormationsPilotageIntentionsUsecase } from "./getFormationsPilotageIntentions.usecase";

const ROUTE = ROUTES["[GET]/pilotage-intentions/formations"];

export const getFormationsPilotageIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
