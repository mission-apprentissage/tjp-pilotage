import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDemandeSchema } from "./getDemande.schema";
import { getDemandeUsecase } from "./getDemande.usecase";

export const getDemandeRoute = (server: Server) => {
  return createRoute("/demande/:numero", {
    method: "GET",
    schema: getDemandeSchema,
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
