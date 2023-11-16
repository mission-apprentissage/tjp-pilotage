import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { countDemandes } from "./countDemandes.query";
import { countDemandesSchema } from "./countDemandes.schema";

export const countDemandesRoute = (server: Server) => {
  return createRoute("/", {
    method: "GET",
    schema: countDemandesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        if (!request.user) throw Boom.forbidden();

        const result = await countDemandes({
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
