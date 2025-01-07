import Boom from "@hapi/boom";
import type { HookHandlerDoneFunction } from "fastify";
import type { FastifyReplyType, FastifyRequestType } from "fastify/types/type-provider";
import { hasPermission } from "shared";
import type { Permission } from "shared/security/permissions";

export const hasPermissionHandler =
  <P extends Permission>(permission: P) =>
    (request: FastifyRequestType, _reply: FastifyReplyType, done: HookHandlerDoneFunction) => {
      if (!request.user) throw Boom.unauthorized();
      if (!request.user.role) throw Boom.forbidden();
      if (!hasPermission(request.user.role, permission)) {
        throw Boom.forbidden();
      }
      done();
    };
