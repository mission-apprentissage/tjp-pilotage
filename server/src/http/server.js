import express from "express";
import bodyParser from "body-parser";
import config from "../config.js";
import { logger } from "../common/logger.js";
import { logMiddleware } from "./middlewares/logMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { tryCatch } from "./middlewares/tryCatchMiddleware.js";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { dbCollection } from "../common/mongodbClient.js";
import { packageJson } from "../common/esm.js";

import passport from "passport";
import cookieParser from "cookie-parser";

import auth from "./routes/user.routes/auth.routes.js";
import register from "./routes/user.routes/register.routes.js";
import password from "./routes/user.routes/password.routes.js";
import session from "./routes/session.routes.js";
import emails from "./routes/emails.routes.js";

export default async (services) => {
  const app = express();

  const checkJwtToken = authMiddleware();

  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());
  app.use(cookieParser());
  app.use(passport.initialize());

  // public access
  app.use("/api/emails", emails()); // No versionning to be sure emails links are always working
  app.use("/api/v1/auth", auth());
  app.use("/api/v1/auth", register(services));
  app.use("/api/v1/password", password());

  // private access
  app.use("/api/v1/session", checkJwtToken, session());

  app.get(
    "/api",
    tryCatch(async (req, res) => {
      let mongodbStatus;

      await dbCollection("logs")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error("Healthcheck failed", e);
        });

      return res.json({
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.use(errorMiddleware());

  return app;
};
