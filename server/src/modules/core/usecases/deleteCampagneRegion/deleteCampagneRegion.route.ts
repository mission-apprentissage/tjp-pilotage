import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteCampagneRegion } from "./deleteCampagneRegion.usecase";

const ROUTE = ROUTES["[DELETE]/campagne-region/:id"];

export const deleteCampagneRegionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes-région/ecriture"),
      handler: async (request, response) => {
        const user = request.user!;
        await deleteCampagneRegion({ id: request.params.id, user });

        response.code(200).send();
      },
    });
  });
};
