import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitCorrectionUsecase } from "./submitCorrection.usecase";

const ROUTE = ROUTES["[POST]/correction/submit"];

export const submitCorrectionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const user = request.user!;
        const { correction } = request.body;

        const result = await submitCorrectionUsecase({
          correction,
          user,
        });

        response.status(200).send(result);
      },
    });
  });
};
