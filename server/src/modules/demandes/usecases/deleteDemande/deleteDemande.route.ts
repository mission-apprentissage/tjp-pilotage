import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteDemande } from "./deleteDemande.usecase";

const ROUTE = ROUTES["[DELETE]/demande/:numero"];

export const deleteDemandeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteDemande({ numero: request.params.numero, user });
        response.status(200).send();
      },
    });
  });
};
