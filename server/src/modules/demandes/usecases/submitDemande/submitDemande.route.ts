import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitDemandeSchema } from "./submitDemande.schema";
import { submitDemande } from "./submitDemande.usecase";

export const submitDemandeRoute = ({ server }: { server: Server }) => {
  return createRoute("/demande/submit", {
    method: "POST",
    schema: submitDemandeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const { demande } = request.body;
        if (!request.user) throw Boom.unauthorized();

        const result = await submitDemande({
          demande,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
