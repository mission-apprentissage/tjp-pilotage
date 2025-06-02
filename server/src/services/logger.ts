import { isBoom } from "@hapi/boom";
import type { Logger as PinoLogger } from "pino";
import { pino } from "pino";
import { ZodError } from "zod";

import config from "@/config";

function getTransport() {
  if (config.log.type === "console") {
    return {
      target: "pino-pretty",
      options: {
        levelFirst: true,
        colorize: true,
        messageKey: "message",
        messageFormat: "{if module} [{module}] - {end} {message}",
        level: config.log.level
      },
    };
  }

  return {
    target: "pino/file",
    options: {
      destination: 1,
      ignore: "pid,hostname",
      level: config.log.level
    },
  };
}

interface ILogger {
  debug(msg: string): unknown;
  info(data: Record<string, unknown>, msg: string): unknown;
  info(msg: string): unknown;
  child(data: Record<string, unknown>): ILogger;
  error(data: Record<string, unknown>, msg: string | Error): unknown;
}

export const withoutSensibleFields = (obj: unknown, seen: Set<unknown>): unknown => {
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

function logFormatter(obj: unknown, seen: Set<unknown>): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (obj instanceof RegExp) {
    return obj.toString();
  }

  if (seen.has(obj)) {
    return "[Circular]";
  }
  seen.add(obj);

  if (obj instanceof Error) {
    const data: Record<string, unknown> = {
      message: obj.message,
      stack: obj.stack,
      cause: logFormatter(obj.cause, seen),
    };

    if (isBoom(obj)) {
      data.isBoom = true;
      data.isServer = obj.isServer;
      data.output = obj.output;
      data.data = logFormatter(obj.data, seen);
    }

    if (obj instanceof ZodError) {
      data.data = obj.format();
    }

    return data;
  }

  if (Array.isArray(obj)) {
    return obj.map((e) => logFormatter(e, seen));
  }

  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[key] = logFormatter(value, seen);

      return acc;
    },
    {} as Record<string, unknown>
  );
}

export function createJobProcessorLogger(logger: PinoLogger<never>): ILogger {
  return {
    debug(msg: string) {
      logger.debug(msg);
    },
    info(data: Record<string, unknown> | string, msg?: string) {
      logger.info(data, msg);
    },
    child(data) {
      return createJobProcessorLogger(logger.child(data));
    },
    error(data: Record<string, unknown>, msg: string | Error) {
      if (msg instanceof Error) {
        logger.error({ error: msg, data });
      } else {
        logger.error(data, msg);
      }
    },
  };
}

const logger = pino({
  name: config.productName,
  enabled: process.env.NODE_ENV !== "test",
  level: config.log.level,
  transport: getTransport(),
  messageKey: "message",
  formatters: {
    log(data: Record<string, unknown>): Record<string, unknown> {
      return logFormatter(withoutSensibleFields(data, new Set()), new Set()) as Record<string, unknown>;
    },
  },
  serializers: {
    err: (err) => err,
  },
});

export default logger;
