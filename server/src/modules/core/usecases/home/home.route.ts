import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import config from "@/config";
import type { Server } from "@/server/server";

const ROUTE = ROUTES["[GET]/healthcheck"];

export const homeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        response.status(200).send({
          name: config.productName,
          version: config.version,
          env: config.env,
        });
      },
    });
  });
};
