import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getCurrentCampagne } from "./getCurrentCampagne.query";
import { getCurrentCampagneSchema } from "./getCurrentCampagne.schema";

export const getCurrentCampagneRoute = (server: Server) => {
  return createRoute("/campagne/current", {
    method: "GET",
    schema: getCurrentCampagneSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        if (!request.user) throw Boom.forbidden();
        const campagne = await getCurrentCampagne();
        response.status(200).send(campagne);
      },
    });
  });
};
