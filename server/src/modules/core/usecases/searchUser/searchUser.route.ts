import * as Boom from "@hapi/boom";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { getScopeFilterForUser } from "@/modules/core/utils/getScopeFilterForUser";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { searchUser } from "./searchUser.usecase";

const ROUTE = ROUTES["[GET]/user/search/:search"];

export const searchUserRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["users/lecture"]),
      handler: async (request, response) => {
        const { search } = request.params;
        const { user } = request;

        if (!user) throw Boom.unauthorized();

        const { scope, scopeFilter } = getScopeFilterForUser(PermissionEnum["users/lecture"], user);

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
