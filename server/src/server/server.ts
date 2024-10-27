import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifyRateLimit } from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import { fastifySwagger } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { notFound } from "@hapi/boom";
import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import qs from "qs";
import { MAX_FILE_SIZE } from "shared";

import config from "@/config";
import { initSentryFastify } from "@/services/sentry/sentry.fastify";
import { getStaticDirPath } from "@/utils/getStaticFilePath";

import { errorMiddleware } from "./middlewares/errorMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";
import { registerRoutes } from "./routes/routes";

export type Server = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export async function bind(app: Server) {
  initSentryFastify(app);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifySwagger, {
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

  await app.register(fastifyRateLimit, { global: false });

  const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/api/documentation",
    uiConfig: {
      displayOperationId: true,
      operationsSorter: "method",
      tagsSorter: "alpha",
      docExpansion: "none",
      filter: true,
      deepLinking: true,
      // docExpansion: "list",
      // deepLinking: false,
    },
  };
  await app.register(fastifySwaggerUi, swaggerUiOptions);

  app.register(fastifyCookie);

  app.register(fastifyMultipart, {
    limits: { fileSize: MAX_FILE_SIZE },
  });

  app.register(fastifyCors, {
    ...(config.env === "local"
      ? {
          origin: true,
          credentials: true,
        }
      : {}),
  });

  if (config.env === "local") {
    // TODO
    app.register(fastifyStatic, {
      root: getStaticDirPath(),
      prefix: "/public/",
    });
  }

  // app.addHook("onRequest", extractUserInRequest);
  // app.addHook("onRequest", userLastSeenAt);
  // app.register(loggerContextPlugin);

  app.register(
    async (instance: Server) => {
      registerRoutes({ server: instance });
    },
    { prefix: "/api" }
  );

  app.setNotFoundHandler((_req, res) => {
    res.status(404).send(notFound("Path does not exists").output);
  });

  errorMiddleware(app);

  return app;
}

export default async (): Promise<Server> => {
  const app: Server = fastify({
    querystringParser: (str) => qs.parse(str),
    logger: logMiddleware(),
    trustProxy: 1,
    caseSensitive: false,
  }).withTypeProvider<ZodTypeProvider>();

  return bind(app);
};

// server.setErrorHandler((error, _, reply) => {
//   handleErrorCb?.(error);

//   if ("details" in error && error.details instanceof ZodError) {
//     logger.error(error.message, {
//       error,
//       details: error.details.errors,
//     });
//     reply.status(500).send({ error: "internal error", statusCode: 500 });
//     return;
//   }

//   if (Boom.isBoom(error)) {
//     reply.status(error.output.statusCode).send({ ...error.output.payload, ...error.data });
//     if (error.output.statusCode >= 500) {
//       logger.error(error.message, { error, data: error.data });
//     }
//     return;
//   }

//   if (error.statusCode === 413) {
//     reply.status(413).send({
//       error: "Payload Too Large",
//       message: `The max allowed payload size is of ${MAX_FILE_SIZE_IN_MB} MB`,
//       statusCode: 413,
//     });
//     return;
//   }

//   if (!error.statusCode || error.statusCode >= 500) {
//     logger.error(error.message, { error });
//     reply.status(500).send({ error: "internal error", statusCode: 500 });
//     return;
//   }

//   if (error.statusCode && error.statusCode < 500) {
//     reply.status(error.statusCode).send({
//       statusCode: error.statusCode,
//       message: error.message,
//       error: error.name,
//     });
//     return;
//   }

//   if (config.env === "local") {
//     reply.status(500).send({
//       error: error.name,
//       statusCode: 500,
//       message: error.message,
//     });
//     return;
//   }
//   reply.status(500).send({ error: "internal error", statusCode: 500 });
// });
