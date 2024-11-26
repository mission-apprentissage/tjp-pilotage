import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { countDemandesSchema } from "./countDemandes.schema";
import { countDemandesUsecase } from "./countDemandes.usecase";

export const countDemandesRoute = (server: Server) => {
  return createRoute("/demandes/count", {
    method: "GET",
    schema: countDemandesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { user, query: filters } = request;
        const result = await countDemandesUsecase({
          user: user!,
          ...filters,
        });
        response.status(200).send(result);
      },
    });
  });
};
