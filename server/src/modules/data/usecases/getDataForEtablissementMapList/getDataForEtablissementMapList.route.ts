import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getDataForEtablissementMapList } from "./getDataForEtablissementMapList.usecase";

const ROUTE = ROUTES["[GET]/etablissement/:uai/map/list"];

export const getDataForEtablissementMapListRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const stats = await getDataForEtablissementMapList({ ...request.params }, { ...request.query });
        response.status(200).send({
          ...stats,
        });
      },
    });
  });
};
