import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";
import { HookHandlerDoneFunction } from "fastify";
import {
  FastifyReplyType,
  FastifyRequestType,
} from "fastify/types/type-provider";
import fp from "fastify-plugin";
import winston from "winston";
import Transport from "winston-transport";

import { config } from "../config/config";
import { sendToSlack } from "./modules/core/services/slack/slack";
import { Server } from "./server";

const emojis = {
  info: "ℹ️",
  error: "🚨",
};

const sendLogToSlack = async (info: {
  level: string;
  message: string;
  userId?: string;
}) => {
  try {
    await sendToSlack(
      [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${emojis[info.level as keyof typeof emojis]} ${
              info.level
            }: ${info.message}`,
            emoji: true,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `*Env:* ${config.env}`,
            },
            {
              type: "mrkdwn",
              text: `*userId:* ${info.userId}`,
            },
            {
              type: "mrkdwn",
              text: `*date:* ${new Date().toLocaleString()}`,
            },
          ],
        },
      ],
      [
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `*details:*\n${JSON.stringify(info ?? {}, null, "  ")}`,
            },
          ],
        },
      ]
    );
    // eslint-disable-next-line no-empty
  } catch (e) {}
};

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: () => new Date().toISOString() }),
    winston.format.json()
  ),
  silent: config.env === "test",
  transports: [
    new winston.transports.Console({ format: winston.format.prettyPrint() }),
    ...(config.slack.token
      ? [
          new Transport({
            log: (
              info: { level: string; message: string; userId?: string },
              callback
            ) => {
              sendLogToSlack(info);
              callback();
            },
          }),
        ]
      : []),
  ],
});
const asyncLocalStorage = new AsyncLocalStorage();

const getContext = () =>
  (asyncLocalStorage.getStore() ?? {}) as {
    userId?: string;
    requestId: string;
  };

export const logger = {
  info: (msg: string, details?: object) => {
    const logOrigin = getLogOrigin();
    const { userId, requestId } = getContext();
    winstonLogger.info(msg, {
      userId,
      requestId,
      details,
      logOrigin,
    });
  },
  error: (
    msg: string,
    { error, ...details }: { error: Error } & Record<string, any>
  ) => {
    const logOrigin = getLogOrigin();
    const { userId, requestId } = getContext();
    winstonLogger.error(msg, {
      userId,
      requestId,
      details,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        logOrigin,
      },
    });
  },
};

const getLogOrigin = () => {
  const stack = new Error().stack;
  return stack?.split("\n")[3].replace(/.*\(/, "").replace(/\)$/, "");
};

export const loggerContextPlugin = fp(
  (instance: Server, opts: unknown, done: (err?: Error) => void) => {
    instance.addHook(
      "onRequest",
      (
        req: FastifyRequestType,
        res: FastifyReplyType,
        done: HookHandlerDoneFunction
      ) => {
        asyncLocalStorage.run(
          {
            userId: req.user?.id,
            requestId: randomUUID().slice(0, 13).replace("-", ""),
          },
          () => done()
        );
      }
    );
    done();
  }
);
