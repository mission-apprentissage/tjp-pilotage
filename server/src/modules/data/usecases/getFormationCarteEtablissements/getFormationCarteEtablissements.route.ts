import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getFormationCarteEtablissementsUsecase } from "./getFormationCarteEtablissements.usecase";

const ROUTE = ROUTES["[GET]/formation/:cfd/map"];

export const getFormationCarteEtablissementsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const result = await getFormationCarteEtablissementsUsecase({ ...request.params }, { ...request.query });
        response.status(200).send(result);
      },
    }),
  );
};
