import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { editUser } from "./editUser.usecase";

const ROUTE = ROUTES["[PUT]/users/:userId"];

export const editUserRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("users/ecriture"),
      handler: async (request, response) => {
        const { user } = request;

        await editUser({
          userId: request.params.userId,
          data: request.body,
          requestUser: user!,
        });
        response.code(200).send();
      },
    });
  });
};
