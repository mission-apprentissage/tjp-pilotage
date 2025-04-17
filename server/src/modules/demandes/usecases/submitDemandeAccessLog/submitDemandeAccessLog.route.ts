import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { submitDemandeAccessLogUsecase } from "./submitDemandeAccessLog.usecase";

const ROUTE = ROUTES["[POST]/demande/access/submit"];

export const submitDemandeAccessLogRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { demande } = request.body;

        const result = await submitDemandeAccessLogUsecase({
          user: request.user!,
          demande,
        });
        response.status(200).send(result);
      },
    });
  });
};
