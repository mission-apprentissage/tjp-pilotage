import Boom from "@hapi/boom";
import { RouteShorthandOptions } from "fastify";
import { hasPermission, permissions } from "shared";

export const hasPermissionHandler: <P extends typeof permissions[number]>(
  permission: P
) => RouteShorthandOptions["preHandler"] =
  (permission) => (request, reply, done) => {
    if (!request.user) throw Boom.unauthorized();
    if (!request.user.role) throw Boom.forbidden();
    if (!hasPermission(request.user.role, permission)) {
      throw Boom.forbidden();
    }
    done();
  };
