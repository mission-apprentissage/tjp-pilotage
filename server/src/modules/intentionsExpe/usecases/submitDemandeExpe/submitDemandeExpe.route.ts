import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { submitDemandeExpeSchema } from "./submitDemandeExpe.schema";
import { submitDemandeExpeUsecase } from "./submitDemandeExpe.usecase";

export const submitDemandeExpeRoute = ({ server }: { server: Server }) => {
  return createRoute("/demande/expe/submit", {
    method: "POST",
    schema: submitDemandeExpeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const { demande } = request.body;
        if (!request.user) throw Boom.unauthorized();

        const result = await submitDemandeExpeUsecase({
          demandeExpe: demande,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
