import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { importIntentionSchema } from "./importIntention.schema";
import { importIntentionUsecase } from "./importIntention.usecase";

export const importIntentionRoute = (server: Server) => {
  return createRoute("/intention/import/:numero", {
    method: "POST",
    schema: importIntentionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user;
        if (!user) throw Boom.forbidden();

        const demande = await importIntentionUsecase({
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
