import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getCampagneById } from "./getCampagne.query";

const ROUTE = ROUTES["[GET]/campagne/:campagneId"];

export const getCampagneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { campagneId } = request.params;
        const user = request.user;
        const campagne = await getCampagneById({ campagneId, user });
        response.status(200).send(campagne);
      },
    });
  });
};
