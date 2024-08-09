import { z } from "zod";

export const isMaintenanceSchema = {
  response: {
    200: z.object({
      isMaintenance: z.boolean(),
    }),
  },
};
