import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Boom from "@hapi/boom";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import path from "path";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_IN_MB } from "shared";
import { EnvEnum } from "shared/enum/envEnum";
import { ZodError } from "zod";

import { config } from "../config/config";
import { logger, loggerContextPlugin } from "./logger";
import { extractUserInRequest } from "./modules/core";
import { userLastSeenAt } from "./modules/core/utils/lastSeenAt/userLastSeenAt";
import { registerRoutes } from "./routes";
import { Server } from "./server";

export const build = (
  server: Server,
  handleErrorCb?: (error: Error) => void
) => {
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

  server.register(fastifyMultipart, {
    limits: { fileSize: MAX_FILE_SIZE },
  });

  if (config.env === EnvEnum.dev) {
    server.register(fastifyStatic, {
      root: path.join(__dirname, "../public"),
      prefix: "/public/",
    });
  }

  server.setErrorHandler((error, _, reply) => {
    handleErrorCb?.(error);

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

    if (error.statusCode === 413) {
      reply.status(413).send({
        error: "Payload Too Large",
        message: `The max allowed payload size is of ${MAX_FILE_SIZE_IN_MB} MB`,
        statusCode: 413,
      });
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

  server.addHook("onRequest", extractUserInRequest);
  server.addHook("onRequest", userLastSeenAt);
  server.register(loggerContextPlugin);

  server.register(async (instance: Server) => registerRoutes(instance), {
    prefix: "/api",
  });

  return server;
};
