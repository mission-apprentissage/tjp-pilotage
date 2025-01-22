import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDemandesRestitutionIntentionsUsecase } from "./getDemandesRestitutionIntentions.usecase";

const ROUTE = ROUTES["[GET]/restitution-intentions/demandes"];

export const getDemandesRestitutionIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("restitution-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const user = request.user!;

        const result = await getDemandesRestitutionIntentionsUsecase({
          ...filters,
          user,
        });
        response.status(200).send(result);
      },
    });
  });
};
