import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { getScopeFilterForUser } from "@/modules/core/utils/getScopeFilterForUser";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getUsers } from "./getUsers.usecase";

const ROUTE = ROUTES["[GET]/users"];

export const getUsersRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("users/lecture"),
      handler: async (request, response) => {
        const { user } = request;

        const { order, orderBy, ...rest } = request.query;
        const { scope, scopeFilter } = getScopeFilterForUser("users/lecture", user!);

        const users = await getUsers({
          ...rest,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
          scope,
          scopeFilter,
        });
        response.code(200).send(users);
      },
    });
  });
};
