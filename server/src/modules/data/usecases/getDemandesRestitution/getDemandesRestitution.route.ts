import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDemandesRestitutionUsecase } from "./getDemandesRestitution.usecase";

const ROUTE = ROUTES["[GET]/restitution/demandes"];

export const getDemandesRestitutionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["restitution/lecture"]),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const user = request.user!;

        const result = await getDemandesRestitutionUsecase({
          ...filters,
          user,
        });
        response.status(200).send(result);
      },
    });
  });
};
