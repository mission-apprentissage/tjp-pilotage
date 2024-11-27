import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getChangelog } from "./getChangelog.usecase";

export const ROUTE = ROUTES["[GET]/changelog"];

export const getChangelogRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        const changelog = await getChangelog();
        response.code(200).send(changelog);
      },
    });
  });
};
