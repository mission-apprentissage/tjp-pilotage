import Boom from "@hapi/boom";
import cookie from "cookie";
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { activateUser } from "../usecases/activateUser/activateUser.usecase";
import { login } from "../usecases/login/login.usecase";
import { sendResetPassword } from "../usecases/sendResetPassword/sendResetPassword.usecase";

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
      const user = request.user;
      if (!user) throw Boom.unauthorized();
      response.status(200).send({ user });
    }
  );

  server.post(
    "/auth/activate",
    { schema: ROUTES_CONFIG.activateUser },
    async (request, response) => {
      const { password, repeatPassword, activationToken } = request.body;

      await activateUser({
        password,
        repeatPassword,
        activationToken,
      });
      response.status(200).send();
    }
  );

  server.post(
    "/auth/send-reset-password",
    { schema: ROUTES_CONFIG["send-reset-password"] },
    async (request, response) => {
      const { email } = request.body;
      await sendResetPassword({ email });
      response.status(200).send();
    }
  );
};
