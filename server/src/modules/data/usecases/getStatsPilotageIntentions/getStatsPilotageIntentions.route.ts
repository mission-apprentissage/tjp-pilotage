import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getStatsPilotageIntentionsUsecase } from "./getStatsPilotageIntentions.usecase";

const ROUTE = ROUTES["[GET]/pilotage-intentions/stats"];

export const getStatsPilotageIntentionsRoute = (server: Server) => {
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

        const statsTauxTransfo = await getStatsPilotageIntentionsUsecase(
          {
            ...filters,
            user,
          }
        );
        response.status(200).send(statsTauxTransfo);
      },
    });
  });
};
