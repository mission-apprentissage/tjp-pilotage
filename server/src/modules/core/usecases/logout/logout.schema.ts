import { z } from "zod";
export const logoutSchema = {
  response: {
    200: z.void(),
  },
};
