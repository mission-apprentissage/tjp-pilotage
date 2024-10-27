import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { isMaintenanceSchema } from "./isMaintenance.schema";
import { isMaintenanceUsecase } from "./isMaintenance.usecase";

export const isMaintenanceRoute = (server: Server) => {
  return createRoute("/maintenance", {
    method: "GET",
    schema: isMaintenanceSchema,
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
