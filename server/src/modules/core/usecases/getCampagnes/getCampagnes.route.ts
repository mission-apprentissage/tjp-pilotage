import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import {getCampagnesQuery} from './getCampagnes.query';

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
        const campagnes = await getCampagnesQuery();
        response.status(200).send(campagnes);
      },
    });
  });
};
