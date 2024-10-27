import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { importDemandeSchema } from "./importDemande.schema";
import { importDemande } from "./importDemande.usecase";

export const importDemandeRoute = (server: Server) => {
  return createRoute("/demande/import/:numero", {
    method: "POST",
    schema: importDemandeSchema,
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
