import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { submitChangementStatutSchema } from "./submitChangementStatut.schema";
import { submitChangementStatutUsecase } from "./submitChangementStatut.usecase";

export const submitChangementStatutRoute = ({ server }: { server: Server }) => {
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
