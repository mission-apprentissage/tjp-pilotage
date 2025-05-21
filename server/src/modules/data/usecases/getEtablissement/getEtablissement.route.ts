import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getEtablissementUsecase } from "./getEtablissement.usecase";

const ROUTE = ROUTES["[GET]/etablissement/:uai"];

export const getEtablissementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getEtablissementUsecase({ uai });
        response.status(200).send(result);
      },
    });
  });
};
