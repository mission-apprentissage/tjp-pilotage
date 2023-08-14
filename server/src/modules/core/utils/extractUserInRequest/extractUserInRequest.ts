import cookie from "cookie";
import { FastifyRequest } from "fastify";
import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { cleanNull } from "../../../../utils/noNull";
import { findUserQuery } from "./findUserQuery.dep";

type RequestUser = { email: string; id: string; role?: "admin" };

export const [extractUserInRequest, extractUserInRequestFactory] = inject(
  { jwtSecret: config.auth.authJwtSecret, findUserQuery },
  (deps) => async (request: FastifyRequest) => {
    const token = cookie.parse(request.headers.cookie ?? "").Authorization;
    if (!token) return;

    const decoded = jwt.verify(token, deps.jwtSecret) as
      | { email: string }
      | undefined;
    if (!decoded) return;

    const user = await deps.findUserQuery({ email: decoded.email });
    if (!user) return;
    request.user = cleanNull(user) as RequestUser;
  }
);

declare module "fastify" {
  interface FastifyRequest {
    user?: RequestUser;
  }
}
