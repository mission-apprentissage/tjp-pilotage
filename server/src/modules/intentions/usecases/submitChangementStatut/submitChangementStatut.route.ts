import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitChangementStatutUsecase } from "./submitChangementStatut.usecase";

const ROUTE = ROUTES["[POST]/intention/statut/submit"];

export const submitChangementStatutRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir-statut/ecriture"),
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
