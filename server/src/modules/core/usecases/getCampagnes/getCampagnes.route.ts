import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../..";
import { getCampagnes } from "./getCampagnes.query";
import { getCampagnesSchema } from "./getCampagnes.schema";

export const getCampagnesRoute = (server: Server) => {
  return createRoute("/campagnes", {
    method: "GET",
    schema: getCampagnesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/lecture"),
      handler: async (request, response) => {
        if (!request.user) throw Boom.forbidden();
        const campagnes = await getCampagnes();
        response.status(200).send(campagnes);
      },
    });
  });
};
