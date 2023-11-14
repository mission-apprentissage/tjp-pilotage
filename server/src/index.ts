import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Boom from "@hapi/boom";

import { config } from "../config/config";
import { logger, loggerContextPlugin } from "./logger";
import { migrateToLatest } from "./migrations/migrate";
import { extractUserInRequest, registerCoreModule } from "./modules/core";
import { registerFormationModule } from "./modules/data/index";
import { registerIntentionsModule } from "./modules/intentions/index";
import { Server, server } from "./server";
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
});

server.register(fastifySwaggerUi, {
  routePrefix: "/api/documentation",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

server.setErrorHandler((error, _, reply) => {
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
  }

  if (error.statusCode && error.statusCode < 500) {
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
      error: error.name,
    });
    return;
  }

  if (config.env === "dev") {
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
server.register(loggerContextPlugin);

const registerRoutes = (instance: Server) => {
  return { ...registerCoreModule({ server: instance }) };
};

export type Router = ReturnType<typeof registerRoutes>;

server.register(
  async (instance: Server) => {
    registerRoutes(instance);
    // registerCoreModule({ server: instance });
    registerFormationModule({ server: instance });
    registerIntentionsModule({ server: instance });
  },
  { prefix: "/api" }
);

const cb = (error: Error | null) => {
  if (error) {
    logger.error("server failed to start", { error });
    process.exit(1);
  } else {
    logger.info("server started");
  }
};

if (config.env !== "dev") {
  migrateToLatest(true).then(() => {
    server.listen({ port: 5000, host: "0.0.0.0" }, cb);
  });
} else {
  server.listen({ port: 5000, host: "0.0.0.0" }, cb);
}
