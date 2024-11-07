import { createRoute } from "@http-wizard/core";
import { API_ROUTES } from "shared/routes/index";

import type { Server } from "@/server/server";

import { getChangelog } from "./getChangelog.usecase";

const route = API_ROUTES.GET["/changelog"];

export const getChangelogRoute = (server: Server) => {
  return createRoute(route.path, {
    method: route.method,
    schema: route.schema,
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
