import Boom from "@hapi/boom";
import cookie from "cookie";
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { login } from "../usecases/login/login.usecase";
import { setUserPassword } from "../usecases/setUserPassword/setUserPassword.usecase";
import { whoAmI } from "../usecases/whoAmI/whoAmI.usecase";

export const authRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/auth/login",
    { schema: ROUTES_CONFIG.login },
    async (request, response) => {
      const { email, password } = request.body;

      const token = await login({ email, password });
      const cookies = cookie.serialize("Authorization", token, {
        maxAge: 30 * 24 * 3600000,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
      });
      response.status(200).header("set-cookie", cookies).send({ token });
    }
  );

  server.post(
    "/auth/logout",
    { schema: ROUTES_CONFIG.logout },
    async (_, response) => {
      const cookies = cookie.serialize("Authorization", "", {
        maxAge: 30 * 24 * 3600000,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
      });
      response.status(200).header("set-cookie", cookies).send();
    }
  );

  server.get(
    "/auth/whoAmI",
    { schema: ROUTES_CONFIG.whoAmI },
    async (request, response) => {
      const token = cookie.parse(request.headers.cookie ?? "").Authorization;
      if (!token) throw Boom.unauthorized();

      const user = await whoAmI({ token });
      response.status(200).send({ user });
    }
  );

  server.post(
    "/auth/set-password",
    { schema: ROUTES_CONFIG.setUserPassword },
    async (request, response) => {
      const { password, repeatPassword, activationToken } = request.body;

      await setUserPassword({
        password,
        repeatPassword,
        activationToken,
      });
      response.status(200).send();
    }
  );
};
