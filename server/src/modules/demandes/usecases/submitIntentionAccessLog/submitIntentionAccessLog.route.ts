import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { submitIntentionAccessLogUsecase } from "./submitIntentionAccessLog.usecase";

const ROUTE = ROUTES["[POST]/demande/access/submit"];

export const submitIntentionAccessLogRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { intention } = request.body;

        const result = await submitIntentionAccessLogUsecase({
          user: request.user!,
          intention,
        });
        response.status(200).send(result);
      },
    });
  });
};
