import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

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
        const { user, query: filters } = request;
        const result = await countIntentionsUsecase({
          user: user!,
          ...filters,
        });
        response.status(200).send(result);
      },
    });
  });
};
