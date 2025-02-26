import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getRepartitionPilotageIntentionsUsecase } from "./getRepartitionPilotageIntentions.usecase";

const ROUTE = ROUTES["[GET]/pilotage-intentions/repartition"];

export const getRepartitionPilotageIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["pilotage-intentions/lecture"]),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const user = request.user!;

        const result = await getRepartitionPilotageIntentionsUsecase({
          ...filters,
          user
        });
        response.status(200).send(result);
      },
    });
  });
};
