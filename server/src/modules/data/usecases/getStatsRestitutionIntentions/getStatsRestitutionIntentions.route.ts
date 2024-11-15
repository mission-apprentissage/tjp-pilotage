import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getStatsRestitutionIntentionsSchema } from "./getStatsRestitutionIntentions.schema";
import { getStatsRestitutionIntentionsUsecase } from "./getStatsRestitutionIntentions.usecase";

export const getStatsRestitutionIntentionsRoute = (server: Server) => {
  return createRoute("/restitution-intentions/stats", {
    method: "GET",
    schema: getStatsRestitutionIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("restitution-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getStatsRestitutionIntentionsUsecase({
          ...filters,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
