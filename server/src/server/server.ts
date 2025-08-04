import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifyRateLimit } from "@fastify/rate-limit";
import { fastifyStatic } from "@fastify/static";
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
import { parse } from "qs";
import { MAX_FILE_SIZE } from "shared";

import config from "@/config";
import { extractUserInRequest } from "@/modules/core";
import { userLastSeenAt } from "@/modules/core/utils/lastSeenAt/userLastSeenAt";
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
    app.register(fastifyStatic, {
      root: getStaticDirPath(),
      prefix: "/public/",
    });
  }

  app.addHook("onRequest", extractUserInRequest);
  app.addHook("onRequest", userLastSeenAt);

  app.register(
    async (instance: Server) => {
      registerRoutes(instance);
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
    querystringParser: (str) => parse(str),
    logger: logMiddleware(),
    trustProxy: 1,
    caseSensitive: false,
  }).withTypeProvider<ZodTypeProvider>();

  return bind(app);
};
