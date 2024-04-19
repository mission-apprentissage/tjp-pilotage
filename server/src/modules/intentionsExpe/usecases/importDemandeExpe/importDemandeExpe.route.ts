import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { importDemandeExpeSchema } from "./importDemandeExpe.schema";
import { importDemandeExpeUsecase } from "./importDemandeExpe.usecase";

export const importDemandeExpeRoute = (server: Server) => {
  return createRoute("/demande/expe/import/:numero", {
    method: "POST",
    schema: importDemandeExpeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user;
        if (!user) throw Boom.forbidden();

        const demande = await importDemandeExpeUsecase({
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
