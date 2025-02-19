import Boom from "@hapi/boom";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitIntentionUsecase } from "./submitIntention.usecase";

const ROUTE = ROUTES["[POST]/intention/submit"];

export const submitIntentionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/ecriture"),
      handler: async (request, response) => {
        const { intention } = request.body;
        if (!request.user) throw Boom.unauthorized();

        const result = await submitIntentionUsecase({
          intention,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
