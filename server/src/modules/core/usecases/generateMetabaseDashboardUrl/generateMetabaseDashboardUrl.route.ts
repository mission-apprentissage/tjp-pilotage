import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getMetabaseDashboardUrlSchema } from "./generateMetabaseDashboardUrl.schema";
import { getMetabaseDashboardUrl } from "./generateMetabaseDashboardUrl.usecase";

export const generateMetabaseDashboardUrlRoute = (server: Server) => {
  return createRoute("/generate-metabase-dashboard-url", {
    method: "POST",
    schema: getMetabaseDashboardUrlSchema,
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
