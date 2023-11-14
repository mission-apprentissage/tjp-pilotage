import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
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
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

export type Server = typeof server;
