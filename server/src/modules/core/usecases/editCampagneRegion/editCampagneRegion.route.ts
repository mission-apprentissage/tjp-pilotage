import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

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
      preHandler: hasPermissionHandler(PermissionEnum["campagnes-région/ecriture"]),
      handler: async (request, response) => {
        await editCampagneRegionUsecase({
          campagneRegion: request.body,
        });
        response.code(200).send();
      },
    });
  });
};
