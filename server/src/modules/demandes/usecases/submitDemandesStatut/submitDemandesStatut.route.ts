import { PermissionEnum } from "shared/enum/permissionEnum";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitDemandesStatutUsecase } from "./submitDemandesStatut.usecase";

const ROUTE = ROUTES["[POST]/demandes/statut/submit"];

export const submitDemandesStatutRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande-statut/ecriture"]),
      handler: async (request, response) => {
        const { demandes, statut } = request.body;

        const result = await submitDemandesStatutUsecase({
          user: request.user!,
          demandes,
          statut
        });
        response.status(200).send(result);
      },
    });
  });
};
