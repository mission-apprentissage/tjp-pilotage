import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { editCampagneUsecase } from "./editCampagne.usecase";

const ROUTE = ROUTES["[PUT]/campagnes/:campagneId"];

export const editCampagneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/ecriture"),
      handler: async (request, response) => {
        await editCampagneUsecase({
          campagne: request.body,
        });
        response.code(200).send();
      },
    });
  });
};
