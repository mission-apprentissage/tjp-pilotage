import { z } from "zod";

export const OrderZodType = z.enum(["asc", "desc"]);

export const OrderEnum = OrderZodType.Enum;

export type OrderType = z.infer<typeof OrderZodType>;
