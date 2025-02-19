import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import type { Server } from "@/server/server";

import { isMaintenanceUsecase } from "./isMaintenance.usecase";

const ROUTE = ROUTES["[GET]/maintenance"];

export const isMaintenanceRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_request, response) => {
        const maintenance = await isMaintenanceUsecase();
        response.code(200).send(maintenance);
      },
    });
  });
};
