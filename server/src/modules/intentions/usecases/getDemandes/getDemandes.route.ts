import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getDemandesSchema } from "./getDemandes.schema";
import { getDemandesUsecase } from "./getDemandes.usecase";

export const getDemandesRoute = (server: Server) => {
  return createRoute("/demandes", {
    method: "GET",
    schema: getDemandesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { search, ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getDemandesUsecase({
          user: request.user,
          ...filters,
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
