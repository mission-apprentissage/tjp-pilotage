import * as Sentry from "@sentry/node";
import cookie from "cookie";
import { FastifyRequest } from "fastify";
import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../model/User";
import { findUserQuery } from "./findUserQuery.dep";

export const [extractUserInRequest, extractUserInRequestFactory] = inject(
  { jwtSecret: config.auth.authJwtSecret, findUserQuery },
  (deps) => async (request: FastifyRequest) => {
    const token = cookie.parse(request.headers.cookie ?? "").Authorization;
    if (!token) return;
    try {
      const decoded = jwt.verify(token, deps.jwtSecret) as
        | { email: string }
        | undefined;
      if (!decoded) return;

      const user = await deps.findUserQuery({ email: decoded.email });

      if (user?.id) {
        Sentry.setUser({ id: user.id });
        Sentry.setTag("role", user?.role);
      }

      if (!user?.enabled) return;
      request.user = cleanNull(user) as RequestUser;
    } catch (e) {
      return;
    }
  }
);

declare module "fastify" {
  interface FastifyRequest {
    user?: RequestUser;
  }
}

declare module "fastify/types/type-provider" {
  interface FastifyRequestType {
    user?: RequestUser;
  }
}
