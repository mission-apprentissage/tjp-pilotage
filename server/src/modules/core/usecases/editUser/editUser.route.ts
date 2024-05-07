import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../utils/hasPermission";
import { editUserSchema } from "./editUser.schema";
import { editUser } from "./editUser.usecase";

export const editUserRoute = (server: Server) => {
  return createRoute("/users/:userId", {
    method: "PUT",
    schema: editUserSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("users/ecriture"),
      handler: async (request, response) => {
        const { user } = request;
        if (!user) throw Boom.unauthorized();
        await editUser({
          userId: request.params.userId,
          data: request.body,
          requestUser: user,
        });
        response.code(200).send();
      },
    });
  });
};
