import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getLatestCampagneUsecase } from "./getLatestCampagne.usecase";


const ROUTE = ROUTES["[GET]/campagne/latest"];

export const getLatestCampagneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_request, response) => {
        const latestCampagne = await getLatestCampagneUsecase();
        response.status(200).send(latestCampagne);
      },
    });
  });
};
