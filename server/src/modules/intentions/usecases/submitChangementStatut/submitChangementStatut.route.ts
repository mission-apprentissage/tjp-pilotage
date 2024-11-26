import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitChangementStatutSchema } from "./submitChangementStatut.schema";
import { submitChangementStatutUsecase } from "./submitChangementStatut.usecase";

export const submitChangementStatutRoute = (server: Server) => {
  return createRoute("/intention/statut/submit", {
    method: "POST",
    schema: submitChangementStatutSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir-statut/ecriture"),
      handler: async (request, response) => {
        const { changementStatut } = request.body;

        const result = await submitChangementStatutUsecase({
          user: request.user!,
          changementStatut,
        });
        response.status(200).send(result);
      },
    });
  });
};
