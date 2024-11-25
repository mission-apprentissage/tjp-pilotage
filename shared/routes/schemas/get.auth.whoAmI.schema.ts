import { z } from "zod";

import type { Role } from "../../security/permissions";
import { PERMISSIONS } from "../../security/permissions";

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
