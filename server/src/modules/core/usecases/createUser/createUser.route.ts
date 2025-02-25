import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { createUser } from "./createUser.usecase";

const ROUTE = ROUTES["[POST]/users/:userId"];

export const createUserRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("users/ecriture"),
      handler: async (request, response) => {
        const { user } = request;

        await createUser({
          body: request.body,
          requestUser: user!,
        });
        response.code(200).send();
      },
    });
  });
};
