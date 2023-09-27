import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import qs from "qs";

const adapter = () => ({
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
  fatal: () => {},
  trace: () => {},
  child: adapter,
  level: "info",
});

export const server = fastify({
  querystringParser: (str) => qs.parse(str),
  logger: adapter(),
  ajv: {
    customOptions: {
      strict: "log",
      removeAdditional: "all",
      keywords: ["kind", "modifier"],
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

export type Server = typeof server;
