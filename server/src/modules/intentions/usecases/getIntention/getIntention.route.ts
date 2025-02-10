import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionUsecase } from "./getIntention.usecase";

const ROUTE = ROUTES["[GET]/intention/:numero"];

export const getIntentionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const intention = await getIntentionUsecase({
          numero: request.params.numero,
          user,
        });

        const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
        const canEdit = guardScope(scope, {
          uai: () => user.uais?.includes(intention.uai) ?? false,
          région: () => user.codeRegion === intention.codeRegion,
          national: () => true,
        });
        response.status(200).send({
          ...intention,
          canEdit,
        });
      },
    });
  });
};
