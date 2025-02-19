import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import type { Server } from "@/server/server";

import { getDataForEtablissementMap } from "./getDataForEtablissementMap.usecase";

const ROUTE = ROUTES["[GET]/etablissement/:uai/map"];

export const getDataForEtablissementMapRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const stats = await getDataForEtablissementMap({ ...request.params }, { ...request.query });
        response.status(200).send({
          ...stats,
        });
      },
    });
  });
};
