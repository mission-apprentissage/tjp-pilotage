import express from "express";
import { tryCatch } from "../middlewares/tryCatchMiddleware.js";
import Boom from "boom";
import { getUser, authenticate, loggedInUser, structureUser } from "../../common/components/usersComponent.js";
import * as sessions from "../../common/components/sessionsComponent.js";
import config from "../../config.js";
import { createUserToken } from "../../common/utils/jwtUtils.js";

const IS_OFFLINE = Boolean(config.isOffline);

export default () => {
  const router = express.Router();

  router.post(
    "/login",
    tryCatch(async (req, res) => {
      const { email, password } = req.body;
      const user = await getUser(email.toLowerCase());
      if (!user) {
        return res.status(401).json({ message: "Accès non autorisé" });
      }

      if (user.orign_register !== "ORIGIN") {
        throw Boom.conflict(`Wrong connection method`, { message: `Mauvaise méthode de connexion` });
      }

      const auth = await authenticate(user.email, password);

      if (!auth) return res.status(401).json({ message: "Accès non autorisé" });

      const payload = await structureUser(user);

      await loggedInUser(payload.email);

      const token = createUserToken({ payload });

      if (await sessions.findJwt(token)) {
        await sessions.removeJwt(token);
      }
      await sessions.addJwt(token);

      res
        .cookie(`tjp-pilotage-${config.env}-jwt`, token, {
          maxAge: 30 * 24 * 3600000,
          httpOnly: !IS_OFFLINE,
          sameSite: "lax",
          secure: !IS_OFFLINE,
        })
        .status(200)
        .json({
          loggedIn: true,
          token,
        });
    })
  );

  router.get(
    "/logout",
    tryCatch(async (req, res) => {
      console.log(req.cookies);
      if (req.cookies[`tjp-pilotage-${config.env}-jwt`]) {
        await sessions.removeJwt(req.cookies[`tjp-pilotage-${config.env}-jwt`]);
        res.clearCookie(`tjp-pilotage-${config.env}-jwt`).status(200).json({
          loggedOut: true,
        });
      } else {
        res.status(401).json({
          error: "Invalid jwt",
        });
      }
    })
  );

  return router;
};
