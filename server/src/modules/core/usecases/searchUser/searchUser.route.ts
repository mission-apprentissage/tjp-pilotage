import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { getScopeFilterForUser } from "@/modules/core/utils/getScopeFilterForUser";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { searchUserSchema } from "./searchUser.schema";
import { searchUser } from "./searchUser.usecase";

export const searchUserRoute = (server: Server) => {
  return createRoute("/user/search/:search", {
    method: "GET",
    schema: searchUserSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("users/lecture"),
      handler: async (request, response) => {
        const { search } = request.params;
        const { user } = request;

        if (!user) throw Boom.unauthorized();

        const { scope, scopeFilter } = getScopeFilterForUser("users/lecture", user);

        const result = await searchUser({
          search,
          scope,
          scopeFilter,
        });

        response.status(200).send(result);
      },
    });
  });
};
