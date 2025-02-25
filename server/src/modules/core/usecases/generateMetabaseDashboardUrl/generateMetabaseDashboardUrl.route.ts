import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getMetabaseDashboardUrl } from "./generateMetabaseDashboardUrl.usecase";

const ROUTE = ROUTES["[POST]/generate-metabase-dashboard-url"];

export const generateMetabaseDashboardUrlRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { filters, dashboard } = request.body;
        const url = await getMetabaseDashboardUrl({ filters, dashboard });

        response.status(200).send({
          url,
        });
      },
    });
  });
};
