import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getDemandes } from "./getDemandes.query";
import { getDemandesSchema } from "./getDemandes.schema";

export const getDemandesRoute = (server: Server) => {
  return createRoute("/demandes", {
    method: "GET",
    schema: getDemandesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { search, campagne, ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();
        const result = await getDemandes({
          user: request.user,
          ...filters,
          search,
          campagne,
        });
        response.status(200).send(result);
      },
    });
  });
};
