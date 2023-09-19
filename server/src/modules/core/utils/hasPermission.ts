import Boom from "@hapi/boom";
import { HookHandlerDoneFunction } from "fastify";
import {
  FastifyReplyType,
  FastifyRequestType,
} from "fastify/types/type-provider";
import { hasPermission, permissions } from "shared";

export const hasPermissionHandler =
  <P extends typeof permissions[number]>(permission: P) =>
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
