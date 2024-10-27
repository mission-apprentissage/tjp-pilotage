import { createRoute } from "@http-wizard/core";

import { getScopeFilterForUser } from "@/modules/core/utils/getScopeFilterForUser";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getUsersSchema } from "./getUsers.schema";
import { getUsers } from "./getUsers.usecase";

export const getUsersRoute = (server: Server) => {
  return createRoute("/users", {
    method: "GET",
    schema: getUsersSchema,
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
