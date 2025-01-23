import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getFormationEtablissements } from "./getFormationEtablissements.usecase";

const ROUTE = ROUTES["[GET]/etablissements"];

export const getFormationEtablissementsRoutes = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const etablissements = await getFormationEtablissements({
          ...filters,
        });
        response.status(200).send(etablissements);
      },
    });
  });
};
