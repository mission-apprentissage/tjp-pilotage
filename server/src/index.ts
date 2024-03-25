import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Boom from "@hapi/boom";
import * as Sentry from "@sentry/node";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { EnvEnum } from "shared/enum/envEnum";
import { ZodError } from "zod";

import { config } from "../config/config";
import { logger, loggerContextPlugin } from "./logger";
import { migrateToLatest } from "./migrations/migrate";
import { registerChangelogModule } from "./modules/changelog";
import { extractUserInRequest, registerCoreModule } from "./modules/core";
import { userLastSeenAt } from "./modules/core/utils/lastSeenAt/userLastSeenAt";
import { registerFormationModule } from "./modules/data";
import { registerGlossaireModule } from "./modules/glossaire";
import { registerIntentionsModule } from "./modules/intentions";
import { Server, server } from "./server";

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
  environment: config.env,
  enabled: config.env !== EnvEnum.dev && config.env !== EnvEnum.test,
});

Sentry.setTag("app", "server");

server.register(fastifyCors, {});

server.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Documentation Orion",
      version: "0.1.0",
    },
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/api/documentation",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

server.setErrorHandler((error, _, reply) => {
  Sentry.captureException(error);

  if ("details" in error && error.details instanceof ZodError) {
    logger.error(error.message, {
      error,
      details: error.details.errors,
    });
    reply.status(500).send({ error: "internal error", statusCode: 500 });
    return;
  }

  if (Boom.isBoom(error)) {
    reply
      .status(error.output.statusCode)
      .send({ ...error.output.payload, ...error.data });
    if (error.output.statusCode >= 500) {
      logger.error(error.message, { error, data: error.data });
    }
    return;
  }

  if (!error.statusCode || error.statusCode >= 500) {
    logger.error(error.message, { error });
    reply.status(500).send({ error: "internal error", statusCode: 500 });
    return;
  }

  if (error.statusCode && error.statusCode < 500) {
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
      error: error.name,
    });
    return;
  }

  if (config.env === EnvEnum.dev) {
    reply.status(500).send({
      error: error.name,
      statusCode: 500,
      message: error.message,
    });
    return;
  }
  reply.status(500).send({ error: "internal error", statusCode: 500 });
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
  logger.error("error: process exit", { error, origin });
});

server.addHook("onRequest", extractUserInRequest);
server.addHook("onRequest", userLastSeenAt);
server.register(loggerContextPlugin);

const registerRoutes = (instance: Server) => {
  return {
    ...registerCoreModule({ server: instance }),
    ...registerFormationModule({ server: instance }),
    ...registerIntentionsModule({ server: instance }),
    ...registerChangelogModule({ server: instance }),
    ...registerGlossaireModule({ server: instance }),
  };
};

export type Router = ReturnType<typeof registerRoutes>;

server.register(async (instance: Server) => registerRoutes(instance), {
  prefix: "/api",
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
