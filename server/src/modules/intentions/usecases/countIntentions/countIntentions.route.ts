import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { countIntentionsUsecase } from "./countIntentions.usecase";

const ROUTE = ROUTES["[GET]/intentions/count"];

export const countIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const { ...filters } = request.query;
        const result = await countIntentionsUsecase({
          ...filters,
          user,
        });
        response.status(200).send(result);
      },
    });
  });
};
