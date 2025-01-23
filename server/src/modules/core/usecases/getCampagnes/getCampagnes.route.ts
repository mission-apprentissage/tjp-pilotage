import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getCampagnes } from "./getCampagnes.query";

const ROUTE = ROUTES["[GET]/campagnes"];

export const getCampagnesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/lecture"),
      handler: async (_request, response) => {
        const campagnes = await getCampagnes();
        response.status(200).send(campagnes);
      },
    });
  });
};
