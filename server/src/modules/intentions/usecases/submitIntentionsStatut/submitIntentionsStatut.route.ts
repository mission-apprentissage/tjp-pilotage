import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitIntentionsStatutUsecase } from "./submitIntentionsStatut.usecase";

const ROUTE = ROUTES["[POST]/intentions/statut/submit"];

export const submitIntentionsStatutRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir-statut/ecriture"),
      handler: async (request, response) => {
        const { intentions, statut } = request.body;

        const result = await submitIntentionsStatutUsecase({
          user: request.user!,
          intentions,
          statut
        });
        response.status(200).send(result);
      },
    });
  });
};
