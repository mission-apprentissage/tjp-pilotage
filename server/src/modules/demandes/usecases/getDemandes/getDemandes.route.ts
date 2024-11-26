import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDemandesUsecase } from "./getDemandes.usecase";

const ROUTE = ROUTES["[GET]/demandes"];

export const getDemandesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const { search, ...filters } = request.query;
        const result = await getDemandesUsecase({
          user,
          ...filters,
          search,
        });

        const scope = getPermissionScope(user.role, "intentions/ecriture");

        response.status(200).send({
          ...result,
          demandes: result.demandes.map((demande) => ({
            ...demande,
            canEdit: guardScope(scope?.default, {
              region: () => user.codeRegion === demande.codeRegion,
              national: () => true,
            }),
          })),
        });
      },
    });
  });
};
