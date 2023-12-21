import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../utils/hasPermission";
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
        const { order, orderBy, ...rest } = request.query;
        const users = await getUsers({
          ...rest,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        response.code(200).send(users);
      },
    });
  });
};