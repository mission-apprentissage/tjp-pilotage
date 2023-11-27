import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { countRestitutionIntentionsStatsSchema } from "./countRestitutionIntentionsStats.schema";
import { countRestitutionIntentionsStats } from "./countRestitutionIntentionsStats.usecase";

export const countRestitutionIntentionsStatsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/intentions/stats/count", {
    method: "GET",
    schema: countRestitutionIntentionsStatsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("restitution-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await countRestitutionIntentionsStats({
          ...filters,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
