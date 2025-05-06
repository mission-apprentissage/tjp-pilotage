import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getFormationsPilotageUsecase } from "./getFormationsPilotage.usecase";

const ROUTE = ROUTES["[GET]/pilotage/formations"];

export const getFormationsPilotageRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["pilotage/lecture"]),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const user = request.user!;
        const stats = await getFormationsPilotageUsecase({
          ...filters,
          user
        });
        response.status(200).send(stats);
      },
    });
  });
};
