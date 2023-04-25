import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import qs from "qs";

export const server = fastify({
  querystringParser: (str) => qs.parse(str),
  logger: true,
  ajv: {
    customOptions: {
      strict: "log",
      keywords: ["kind", "modifier"],
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

export type Server = typeof server;
