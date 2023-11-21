import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { findDemandes } from "./findDemandes.query";
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
        const { order, orderBy, ...rest } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await findDemandes({
          ...rest,
          user: request.user,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        response.status(200).send(result);
      },
    });
  });
};
