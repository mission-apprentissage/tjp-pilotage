import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { importDemande } from "./importDemande.usecase";

const ROUTE = ROUTES["[POST]/demande/import/:numero"];

export const importDemandeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user!;

        const demande = await importDemande({
          numero: request.params.numero,
          user,
        });
        if (!demande) return response.status(404).send();

        const result = response.status(200).send(demande);

        return result;
      },
    });
  });
};
