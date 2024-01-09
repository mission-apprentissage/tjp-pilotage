import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../utils/hasPermission";
import { createUserSchema } from "./createUser.schema";
import { createUser } from "./createUser.usecase";

export const createUserRoute = (server: Server) => {
  return createRoute("/users/:userId", {
    method: "POST",
    schema: createUserSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("users/ecriture"),
      handler: async (request, response) => {
        await createUser(request.body);
        response.code(200).send();
      },
    });
  });
};
