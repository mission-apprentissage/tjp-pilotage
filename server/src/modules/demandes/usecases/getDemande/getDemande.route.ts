import { getPermissionScope, guardScope } from "shared";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDemandeUsecase } from "./getDemande.usecase";

const ROUTE = ROUTES["[GET]/demande/:numero"];

export const getDemandeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const demande = await getDemandeUsecase({
          numero: request.params.numero,
          user,
        });

        const scope = getPermissionScope(user.role, "intentions/ecriture");
        const canEdit = guardScope(scope?.default, {
          region: () => user.codeRegion === demande.codeRegion,
          national: () => true,
        });
        response.status(200).send({
          ...demande,
          statut: demande.statut,
          canEdit,
        });
      },
    });
  });
};
