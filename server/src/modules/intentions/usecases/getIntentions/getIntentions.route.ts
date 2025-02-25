import { getPermissionScope, guardScope } from "shared";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionsUsecase } from "./getIntentions.usecase";

const ROUTE = ROUTES["[GET]/intentions"];

export const getIntentionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const { ...filters } = request.query;

        const result = await getIntentionsUsecase({
          ...filters,
          user,
        });

        const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");

        response.status(200).send({
          ...result,
          intentions: result.intentions.map((intention) => ({
            ...intention,
            canEdit: guardScope(scope, {
              uai: () => user.uais?.includes(intention.uai) ?? false,
              région: () => user.codeRegion === intention.codeRegion,
              national: () => true,
            }),
          })),
        });
      },
    });
  });
};
