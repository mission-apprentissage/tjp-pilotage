import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../utils/hasPermission";
import { getScopeFilterForUser } from "./getScopeFilterForUser.dep";
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
        if (!user) throw Boom.unauthorized();

        const { order, orderBy, ...rest } = request.query;
        const { scope, scopeFilter } = getScopeFilterForUser(
          "users/lecture",
          user
        );

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
