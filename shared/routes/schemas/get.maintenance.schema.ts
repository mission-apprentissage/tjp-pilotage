import { z } from "zod";

export const getMaintenanceSchema = {
  response: {
    200: z.object({
      isMaintenance: z.boolean(),
    }),
  },
};
