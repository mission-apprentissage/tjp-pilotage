import * as Sentry from "@sentry/node";
import type { FastifyRequest } from "fastify";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import jwt from "jsonwebtoken";

import config from "@/config";
import type { RequestUser } from "@/modules/core/model/User";
import { cleanNull } from "@/utils/noNull";

import { findUserQuery } from "./findUserQuery.dep";

export const [extractUserInRequest, extractUserInRequestFactory] = inject(
  { jwtSecret: config.auth.authJwtSecret, findUserQuery },
  (deps) => async (request: FastifyRequest) => {
    const token = request.cookies["Authorization"];
    if (!token) return;
    try {
      const decoded = jwt.verify(token, deps.jwtSecret) as { email: string } | undefined;
      if (!decoded) return;
      const user = await deps.findUserQuery({ email: decoded.email });

      if (user?.id) {
        Sentry.setUser({ id: user.id });
        Sentry.setTag("role", user?.role);
      }

      if (!user?.enabled) return;
      request.user = cleanNull(user) as RequestUser;
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_e) {
      return;
    }
  }
);

declare module "fastify" {
  interface FastifyRequest {
    user?: RequestUser;
    cookies: { [cookieName: string]: string | undefined };
  }
}

declare module "fastify/types/type-provider" {
  interface FastifyRequestType {
    user?: RequestUser;
  }
}
