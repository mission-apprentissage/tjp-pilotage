import * as Sentry from "@sentry/node";
import { EnvEnum } from "shared/enum/envEnum";

import { config } from "../config/config";
import { build } from "./build";
import { logger } from "./logger";
import { migrateToLatest } from "./migrations/migrate";
import { server as fastifyServer } from "./server";

if (config.env !== EnvEnum.test) {
  Sentry.init({
    dsn: config.sentry.dsn,
    tracesSampleRate: 1.0,
    environment: config.env,
    enabled: config.env === EnvEnum.production,
  });

  Sentry.setTag("app", "server");
}

process.on("uncaughtExceptionMonitor", (error, origin) => {
  logger.error("error: process exit", { error, origin });
});

export const server = build(fastifyServer, (error) => {
  Sentry.captureException(error);
});

const cb = (error: Error | null) => {
  if (error) {
    logger.error("server failed to start", { error });
    process.exit(1);
  } else {
    logger.info("server started");
  }
};

if (config.env !== EnvEnum.dev) {
  migrateToLatest(true).then(() => {
    server.listen({ port: 5000, host: "0.0.0.0" }, cb);
  });
} else {
  server.listen({ port: 5000, host: "0.0.0.0" }, cb);
}
