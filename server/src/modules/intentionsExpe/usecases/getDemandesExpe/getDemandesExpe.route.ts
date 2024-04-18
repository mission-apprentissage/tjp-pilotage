import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getDemandesExpeSchema } from "./getDemandesExpe.schema";
import { getDemandesExpeUsecase } from "./getDemandesExpe.usecase";

export const getDemandesExpeRoute = (server: Server) => {
  return createRoute("/demandes/expe", {
    method: "GET",
    schema: getDemandesExpeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { search, ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getDemandesExpeUsecase({
          user: request.user,
          ...filters,
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
