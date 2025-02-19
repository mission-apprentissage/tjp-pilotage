import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitSuiviUsecase } from "./submitSuivi.usecase";

const ROUTE = ROUTES["[POST]/intention/suivi"];

export const submitSuiviRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const { intentionNumero } = request.body;

        const result = await submitSuiviUsecase({
          user: request.user!,
          intentionNumero,
        });
        response.status(200).send(result);
      },
    });
  });
};
