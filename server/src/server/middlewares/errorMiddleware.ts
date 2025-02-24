import { badRequest, Boom, internal, isBoom } from "@hapi/boom";
import { captureException } from "@sentry/node";
import type { FastifyError } from "fastify";
import { ResponseValidationError } from "fastify-type-provider-zod";
import type { IResError } from "shared/models/errors";
import { ZodError } from "zod";

import config from "@/config";
import type { Server } from "@/server/server";
import logger from "@/services/logger";

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

const withoutSensibleFields = (obj: unknown, seen: Set<unknown>): unknown => {
  if (obj == null) return obj;

  if (typeof obj === "object") {
    if (seen.has(obj)) {
      return "(ref)";
    }

    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map((v) => withoutSensibleFields(v, seen));
    }

    if (obj instanceof Set) {
      return Array.from(obj).map((v) => withoutSensibleFields(v, seen));
    }

    if (obj instanceof Map) {
      return withoutSensibleFields(Object.fromEntries(obj.entries()), seen);
    }

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const lower = key.toLowerCase();
        if (
          lower.indexOf("token") !== -1 ||
          ["authorization", "password", "pwd"].includes(lower)
        ) {
          return [key, "*****"];
        }

        return [key, withoutSensibleFields(value, seen)];
      })
    );
  }

  if (typeof obj === "string") {
    // max 2Ko
    return obj.length > 2000 ? obj.substring(0, 2_000) + "..." : obj;
  }

  return obj;
};

export function errorMiddleware(server: Server) {
  server.setErrorHandler<FastifyError | Boom<unknown> | Error | ZodError, { Reply: IResError }>(
    (rawError, _request, reply) => {
      const logGenericInfo = {
        req: {
          url: _request.url,
          params: withoutSensibleFields(_request.params, new Set([])),
          body: withoutSensibleFields(_request.body, new Set()),
          user: _request.user ? withoutSensibleFields(_request.user, new Set([])) : undefined
        },
        res: {
          statusCode: reply.statusCode
        }
      };

      if (isBoom(rawError)) {
        logger.error({
          boomError: {
            ...rawError
          },
          ...logGenericInfo
        }, "[API] Boom");
      } else if (rawError instanceof ResponseValidationError) {
        const zodError = new ZodError(rawError.details.error);
        logger.error({
          zodError: zodError.format(),
          message: rawError.message,
          ...logGenericInfo,
          rawError: rawError
        }, "[API] Schema validation error");
      } else if (rawError instanceof ZodError) {
        logger.error({
          zodError: rawError.format(),
          message: rawError.message,
          ...logGenericInfo,
          rawError: rawError
        }, "[API] Schema validation error");
      } else {
        logger.error({
          error: rawError,
          ...logGenericInfo
        }, "[API] Unknown error");
      }

      const payload: IResError = formatResponseError(rawError);

      if (payload.statusCode >= 500) {
        server.log.error(rawError instanceof ZodError ? rawError.format() : rawError);
        captureException(rawError);
      }

      return reply.status(payload.statusCode).send(payload);
    }
  );
}
