import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Boom from "@hapi/boom";

import { migrateToLatest } from "./migrations/migrate";
import { extractUserInRequest, registerAuthModule } from "./modules/auth";
import { registerCoreModule } from "./modules/core";
import { registerFormationModule } from "./modules/data/index";
import { server } from "./server";

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

server.setErrorHandler((error, request, reply) => {
  if (Boom.isBoom(error)) {
    error.output.statusCode;
    reply.status(error.output.statusCode).send(error.output.payload);
    return;
  }
  if (process.env.PILOTAGE_ENV === "dev") {
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

server.register(
  async (instance) => {
    registerCoreModule({ server: instance });
    registerAuthModule({ server: instance });
    registerFormationModule({ server: instance });
  },
  { prefix: "/api" }
);

if (process.env.PILOTAGE_ENV !== "dev") {
  migrateToLatest(true).then(() => {
    server.listen({ port: 5000, host: "0.0.0.0" }, function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  });
} else {
  server.listen({ port: 5000, host: "0.0.0.0" }, function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}
