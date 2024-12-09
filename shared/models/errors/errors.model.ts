import type { Jsonify } from "type-fest";
import { z } from "zod";

export const zResBadRequest = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(400),
  })
  .strict();

export const zResUnauthorized = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(401),
  })
  .strict();

export const zResForbidden = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(403),
  })
  .strict();

export const zResNotFound = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(404),
  })
  .strict();

export const zResConflict = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(409),
  })
  .strict();

export const zResTooManyRequest = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(419),
  })
  .strict();

export const zResInternalServerError = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(500),
  })
  .strict();

export const zResBadGateway = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(502),
  })
  .strict();

export const zResServiceUnavailable = z
  .object({
    data: z.any().optional(),
    message: z.string(),
    name: z.string(),
    statusCode: z.literal(502),
  })
  .strict();

export const ZResError = z
  .object({
    data: z.any().optional(),
    code: z.string().nullish(),
    message: z.string(),
    name: z.string(),
    statusCode: z.number(),
  })
  .strict();

export type IResError = z.input<typeof ZResError>;
export type IResErrorJson = Jsonify<z.output<typeof ZResError>>;
