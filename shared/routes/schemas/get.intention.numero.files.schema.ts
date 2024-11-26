import { z } from "zod";

import { fileTypeSchema } from "../../files/types";

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
