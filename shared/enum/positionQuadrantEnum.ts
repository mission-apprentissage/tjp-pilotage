import { z } from "zod";

export const PositionQuadrantZodType = z.enum([
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Hors quadrant",
  "-",
]);

export const PositionQuadrantEnum = PositionQuadrantZodType.Enum;

export type PositionQuadrantType = z.infer<typeof PositionQuadrantZodType>;
