import { badRequest, Boom, internal, isBoom } from "@hapi/boom";
import { captureException } from "@sentry/node";
import type { FastifyError } from "fastify";
import { ResponseValidationError } from "fastify-type-provider-zod";
import type { IResError } from "shared/models/errors";
import { ZodError } from "zod";

import config from "@/config";
import type { Server } from "@/server/server";

export function boomify(rawError: FastifyError | Boom<unknown> | Error | ZodError): Boom<unknown> {
  if (isBoom(rawError)) {
    return rawError;
  }

  if (rawError instanceof ResponseValidationError) {
    if (config.env === "local") {
      const zodError = new ZodError(rawError.details.error);
      return internal(rawError.message, {
        validationError: zodError.format(),
      });
    }

    return internal();
  }

  if (rawError instanceof ZodError) {
    return badRequest("Request validation failed", { validationError: rawError.format() });
  }

  if ((rawError as FastifyError).statusCode) {
    return new Boom(rawError.message, {
      statusCode: (rawError as FastifyError).statusCode ?? 500,
      data: { rawError },
    });
  }

  if (config.env === "local") {
    return internal(rawError.message, { rawError, cause: rawError });
  }

  return internal();
}

export function formatResponseError(rawError: FastifyError | Boom<unknown> | Error | ZodError): IResError {
  const error = boomify(rawError);

  const result: IResError = {
    statusCode: error.output.statusCode,
    name: error.output.payload.error,
    message: "The server was unable to complete your request",
  };

  if (error.output.statusCode >= 500) {
    return result;
  }

  result.message = error.message;

  if (error.data) {
    result.data = error.data;
  }

  return result;
}

export function errorMiddleware(server: Server) {
  server.setErrorHandler<FastifyError | Boom<unknown> | Error | ZodError, { Reply: IResError }>(
    (rawError, _request, reply) => {
      const payload: IResError = formatResponseError(rawError);

      if (payload.statusCode >= 500) {
        server.log.error(rawError instanceof ZodError ? rawError.format() : rawError);
        captureException(rawError);
      }

      return reply.status(payload.statusCode).send(payload);
    }
  );
}
