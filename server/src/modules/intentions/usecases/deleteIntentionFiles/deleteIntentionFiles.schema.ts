import { z } from "zod";

import { fileTypeSchema } from "@/modules/core/services/fileManager/fileManager";

export const deleteIntentionFilesSchema = {
  params: z.object({ numero: z.string() }),
  body: z.object({
    files: z.array(fileTypeSchema),
  }),
  response: {
    200: z.void(),
  },
};
