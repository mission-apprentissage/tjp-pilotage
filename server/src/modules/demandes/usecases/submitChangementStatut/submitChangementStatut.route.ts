import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitChangementStatutUsecase } from "./submitChangementStatut.usecase";

const ROUTE = ROUTES["[POST]/demande/statut/submit"];

export const submitChangementStatutRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande-statut/ecriture"]),
      handler: async (request, response) => {
        const { changementStatut } = request.body;

        const result = await submitChangementStatutUsecase({
          user: request.user!,
          changementStatut,
        });
        response.status(200).send(result);
      },
    });
  });
};
