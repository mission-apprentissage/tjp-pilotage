import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getCurrentCampagneUsecase } from "./getCurrentCampagne.usecase";

const ROUTE = ROUTES["[GET]/campagne/current"];

export const getCurrentCampagneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const user = request.user;
        const campagneEnCours = await getCurrentCampagneUsecase(user);
        response.status(200).send(campagneEnCours);
      },
    });
  });
};
