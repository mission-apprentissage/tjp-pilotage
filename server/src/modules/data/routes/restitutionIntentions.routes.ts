import Boom from "@hapi/boom";
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { getCountRestitutionIntentionsStats } from "../usecases/countRestitutionIntentionsStats/countRestitutionIntentionsStats.usecase";
import { getRestitutionIntentionsStats } from "../usecases/getRestitutionIntentionsStats/getRestitutionIntentionsStats.usecase";

export const restitutionIntentionsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/intentions/stats",
    {
      schema: ROUTES_CONFIG.getRestitutionIntentionsStats,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      if (!request.user) throw Boom.forbidden();

      const result = await getRestitutionIntentionsStats({
        ...rest,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        user: request.user,
      });
      response.status(200).send(result);
    }
  );

  server.get(
    "/intentions/stats/count",
    {
      schema: ROUTES_CONFIG.countRestitutionIntentionsStats,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { ...filters } = request.query;
      if (!request.user) throw Boom.forbidden();

      const result = await getCountRestitutionIntentionsStats({
        ...filters,
        user: request.user,
      });
      response.status(200).send(result);
    }
  );
};
