import { z } from "zod";

export const getDneUrlSchema = {
  response: { 200: z.object({ url: z.string() }) },
};
