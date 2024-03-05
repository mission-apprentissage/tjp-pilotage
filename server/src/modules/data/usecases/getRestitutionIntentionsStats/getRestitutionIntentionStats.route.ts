import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getRestitutionIntentionsStats } from "./getRestitutionIntentionsStats.usecase";
import { getRestitutionIntentionsStatsSchema } from "./getRestitutionIntentionStats.schema";

export const getRestitutionIntentionsStatsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/intentions/stats", {
    method: "GET",
    schema: getRestitutionIntentionsStatsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("restitution-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getRestitutionIntentionsStats({
          ...filters,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
