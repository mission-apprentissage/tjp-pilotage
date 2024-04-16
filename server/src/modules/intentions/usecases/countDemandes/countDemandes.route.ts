import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { countDemandesSchema } from "./countDemandes.schema";
import { countDemandesUsecase } from "./countDemandes.usecase";

export const countDemandesRoute = (server: Server) => {
  return createRoute("/demandes/count", {
    method: "GET",
    schema: countDemandesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { anneeCampagne } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await countDemandesUsecase({
          user: request.user,
          anneeCampagne,
        });
        response.status(200).send(result);
      },
    });
  });
};
