import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";
import { HookHandlerDoneFunction } from "fastify";
import {
  FastifyReplyType,
  FastifyRequestType,
} from "fastify/types/type-provider";
import fp from "fastify-plugin";
import winston from "winston";
import SlackHook from "winston-slack-webhook-transport";

import { config } from "../config/config";
import { Server } from "./server";

const emojis = {
  info: "ℹ️",
  error: "🚨",
};

const formatSlackMessage = (info: {
  level: string;
  message: string;
  userId?: string;
}) => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${emojis[info.level as keyof typeof emojis]} ${info.level}: ${
            info.message
          }`,
          emoji: true,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Env:* ${process.env.PILOTAGE_ENV}`,
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
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*details:*\n${JSON.stringify(info ?? {}, null, "  ")}`,
          },
        ],
      },
    ],
  };
};

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: () => new Date().toISOString() }),
    winston.format.json()
  ),
  transports: [
    new SlackHook({
      level: "info",
      webhookUrl: config.slackWebhookUrl,
      formatter: formatSlackMessage,
    }),
  ],
});
const asyncLocalStorage = new AsyncLocalStorage();

const getContext = () =>
  (asyncLocalStorage.getStore() ?? {}) as {
    userId?: string;
    requestId: string;
  };

export const myLogger = {
  info: (msg: string, details?: object) => {
    const stack = getCallStack();
    const { userId, requestId } = getContext();
    winstonLogger.info(msg, { userId, requestId, details, stack });
  },
  error: (error: Error, details?: object) => {
    const { userId, requestId } = getContext();
    winstonLogger.error(error.name, {
      userId,
      requestId,
      details,
      error: { name: error.name, message: error.message, stack: error.stack },
    });
  },
};

const getCallStack = () => {
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
