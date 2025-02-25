import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { importIntentionUsecase } from "./importIntention.usecase";

const ROUTE = ROUTES["[POST]/intention/import/:numero"];

export const importIntentionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user!;

        const intention = await importIntentionUsecase({
          numero: request.params.numero,
          user,
        });
        if (!intention) return response.status(404).send();

        const result = response.status(200).send(intention);

        return result;
      },
    });
  });
};
