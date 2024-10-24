import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getDemandesRestitutionIntentionsSchema } from "./getDemandesRestitutionIntentions.schema";
import { getDemandesRestitutionIntentionsUsecase } from "./getDemandesRestitutionIntentions.usecase";

export const getDemandesRestitutionIntentionsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/restitution-intentions/demandes", {
    method: "GET",
    schema: getDemandesRestitutionIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("restitution-intentions/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        if (!request.user) throw Boom.forbidden();

        const result = await getDemandesRestitutionIntentionsUsecase({
          ...filters,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
