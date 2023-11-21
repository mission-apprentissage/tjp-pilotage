import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { submitDraftDemandeSchema } from "./submitDraftDemande.schema";
import { submitDraftDemande } from "./submitDraftDemande.usecase";

export const submitDraftDemandeRoute = (server: Server) => {
  return createRoute("/demande/draft", {
    method: "POST",
    schema: submitDraftDemandeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const { demande } = request.body;
        if (!request.user) throw Boom.unauthorized();

        const result = await submitDraftDemande({
          demande,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
