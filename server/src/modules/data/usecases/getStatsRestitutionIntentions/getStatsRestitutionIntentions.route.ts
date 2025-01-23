import Boom from "@hapi/boom";
import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getStatsRestitutionIntentionsUsecase } from "./getStatsRestitutionIntentions.usecase";

const ROUTE = ROUTES["[GET]/restitution-intentions/stats"];

export const getStatsRestitutionIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("restitution-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getStatsRestitutionIntentionsUsecase({
          ...filters,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
