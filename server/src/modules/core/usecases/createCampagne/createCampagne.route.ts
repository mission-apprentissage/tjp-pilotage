import { PermissionEnum } from "shared/enum/permissionEnum";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { createCampagne } from "./createCampagne.usecase";

const ROUTE = ROUTES["[POST]/campagnes/:campagneId"];

export const createCampagneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["campagnes/ecriture"]),
      handler: async (request, response) => {
        await createCampagne(request.body);

        response.code(200).send();
      },
    });
  });
};
