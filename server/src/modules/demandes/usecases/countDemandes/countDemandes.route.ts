import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { countDemandesUsecase } from "./countDemandes.usecase";

const ROUTE = ROUTES["[GET]/demandes/count"];

export const countDemandesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande/lecture"]),
      handler: async (request, response) => {
        const user = request.user!;
        const { ...filters } = request.query;
        const result = await countDemandesUsecase({
          ...filters,
          user,
        });
        response.status(200).send(result);
      },
    });
  });
};
