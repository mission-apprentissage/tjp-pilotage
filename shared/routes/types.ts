import type { TSchema } from "@sinclair/typebox";
import type { z } from "zod";

export type TMethod = "GET" | "HEAD" | "OPTIONS" | "TRACE" | "PUT" | "DELETE" | "POST" | "PATCH" | "CONNECT";

export type SchemaTypeBox = {
  params?: TSchema;
  querystring?: TSchema;
  body?: TSchema;
  response: Record<number, TSchema>;
};

export type SchemaZod = {
  params?: z.AnyZodObject;
  querystring?: z.AnyZodObject;
  body?: z.Schema;
  response: Record<number, z.Schema>;
};

export interface IRoute {
  url: string;
  method: TMethod;
  schema: SchemaTypeBox | SchemaZod;
}

export interface IRoutesDefinition {
  [url: string]: IRoute;
}
