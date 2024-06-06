import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getIntentionsSchema } from "./getIntentions.schema";
import { getIntentionsUsecase } from "./getIntentions.usecase";

export const getIntentionsRoute = (server: Server) => {
  return createRoute("/intentions", {
    method: "GET",
    schema: getIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const { search, ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getIntentionsUsecase({
          user: request.user,
          ...filters,
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
