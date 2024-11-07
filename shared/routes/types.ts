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

export interface IRoute<TMethod> {
  path: string;
  method: TMethod;
  schema: SchemaTypeBox | SchemaZod;
}

export interface IModuleRoutesDefinition {
  GET?: Record<string, IRoute<"GET">>;
  HEAD?: Record<string, IRoute<"HEAD">>;
  OPTIONS?: Record<string, IRoute<"OPTIONS">>;
  TRACE?: Record<string, IRoute<"TRACE">>;
  PUT?: Record<string, IRoute<"PUT">>;
  DELETE?: Record<string, IRoute<"DELETE">>;
  POST?: Record<string, IRoute<"POST">>;
  PATCH?: Record<string, IRoute<"PATCH">>;
  CONNECT?: Record<string, IRoute<"CONNECT">>;
}
