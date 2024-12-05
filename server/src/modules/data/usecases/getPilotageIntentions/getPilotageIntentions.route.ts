import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getPilotageIntentionsUsecase } from "./getPilotageIntentions.usecase";

const ROUTE = ROUTES["[GET]/pilotage-intentions"];

export const getPilotageIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;

        const result = await getPilotageIntentionsUsecase(filters);
        response.status(200).send(result);
      },
    });
  });
};
