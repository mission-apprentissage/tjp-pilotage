import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getCurrentCampagneSchema } from "./getDefaultCampagne.schema";
import { getDefaultCampagneUsecase } from "./getDefaultCampagne.usecase";

export const getCurrentCampagneRoute = (server: Server) => {
  return createRoute("/campagne/default", {
    method: "GET",
    schema: getCurrentCampagneSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        if (!request.user) throw Boom.forbidden();
        const campagne = await getDefaultCampagneUsecase();
        response.status(200).send(campagne);
      },
    });
  });
};
