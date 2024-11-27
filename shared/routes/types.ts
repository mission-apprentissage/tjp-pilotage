import type { z } from "zod";

export type TMethod = "GET" | "HEAD" | "OPTIONS" | "TRACE" | "PUT" | "DELETE" | "POST" | "PATCH" | "CONNECT";

export type SchemaZod = {
  params?: z.AnyZodObject;
  querystring?: z.AnyZodObject;
  body?: z.Schema;
  response: Record<number, z.Schema>;
};

export interface IRoute {
  url: string;
  method: TMethod;
  schema: SchemaZod;
}

export interface IRoutesDefinition {
  [url: string]: IRoute;
}
