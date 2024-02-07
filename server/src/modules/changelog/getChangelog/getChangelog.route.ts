import { createRoute } from "@http-wizard/core";

import { Server } from "../../../server";
import { getChangelogSchema } from "./getChangelog.schema";
import { getChangelog } from "./getChangelog.usecase";

export const getChangelogRoute = (server: Server) => {
  return createRoute("/changelog", {
    method: "GET",
    schema: getChangelogSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const changelog = await getChangelog()
        response.code(200).send(changelog);
      },
    });
  });
};
