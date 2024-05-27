import { z } from "zod";

import { fileTypeSchema } from "../../../core/services/fileManager/fileManager";

export const getIntentionFilesSchema = {
  params: z.object({
    numero: z.string(),
  }),
  response: {
    200: z.object({
      files: z.array(fileTypeSchema),
    }),
  },
};
