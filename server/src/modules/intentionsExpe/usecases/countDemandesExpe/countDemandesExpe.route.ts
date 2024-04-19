import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { countDemandesSchema } from "./countDemandesExpe.schema";
import { countDemandesUsecase } from "./countDemandesExpe.usecase";

export const countDemandesExpeRoute = (server: Server) => {
  return createRoute("/demandes/expe/count", {
    method: "GET",
    schema: countDemandesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
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
