import Boom from "@hapi/boom";
import { HookHandlerDoneFunction } from "fastify";
import {
  FastifyReplyType,
  FastifyRequestType,
} from "fastify/types/type-provider";
import { hasPermission } from "shared";
import { Permission } from "shared/security/permissions";

export const hasPermissionHandler =
  <P extends Permission>(permission: P) =>
  (
    request: FastifyRequestType,
    reply: FastifyReplyType,
    done: HookHandlerDoneFunction
  ) => {
    if (!request.user) throw Boom.unauthorized();
    if (!request.user.role) throw Boom.forbidden();
    if (!hasPermission(request.user.role, permission)) {
      throw Boom.forbidden();
    }
    done();
  };
