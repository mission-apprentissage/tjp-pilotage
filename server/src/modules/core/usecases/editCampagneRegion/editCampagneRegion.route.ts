import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { editCampagneRegionUsecase } from "./editCampagneRegion.usecase";

const ROUTE = ROUTES["[PUT]/campagnes-region/:campagneRegionId"];

export const editCampagneRegionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes-region/ecriture"),
      handler: async (request, response) => {
        await editCampagneRegionUsecase({
          campagneRegion: request.body,
        });
        response.code(200).send();
      },
    });
  });
};
