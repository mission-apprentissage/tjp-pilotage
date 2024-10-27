import type { Role } from "shared";
import { PERMISSIONS } from "shared";
import { z } from "zod";

export const whoAmISchema = {
  response: {
    200: z
      .object({
        user: z.object({
          id: z.string(),
          email: z.string(),
          role: z.enum(Object.keys(PERMISSIONS) as [Role]).optional(),
          codeRegion: z.string().optional(),
          uais: z.array(z.string()).optional(),
        }),
      })
      .optional(),
  },
};
