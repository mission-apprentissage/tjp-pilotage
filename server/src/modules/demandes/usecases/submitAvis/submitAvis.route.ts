import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitAvisUsecase } from "./submitAvis.usecase";

const ROUTE = ROUTES["[POST]/demande/avis/submit"];

export const submitAvisRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande-avis/ecriture"]),
      handler: async (request, response) => {
        const { avis } = request.body;

        const result = await submitAvisUsecase({
          user: request.user!,
          avis,
        });
        response.status(200).send(result);
      },
    });
  });
};
