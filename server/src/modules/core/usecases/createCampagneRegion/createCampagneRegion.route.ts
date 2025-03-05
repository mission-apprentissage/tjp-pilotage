import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { createCampagneRegion } from "./createCampagneRegion.usecase";

const ROUTE = ROUTES["[POST]/campagnes-region/:campagneRegionId"];

export const createCampagneRegionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["campagnes-région/ecriture"]),
      handler: async (request, response) => {
        await createCampagneRegion(request.body);

        response.code(200).send();
      },
    });
  });
};
