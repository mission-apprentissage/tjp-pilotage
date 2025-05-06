import { z } from "zod";

import { fileTypeSchema } from "../../files/types";

export const deleteDemandeFilesSchema = {
  params: z.object({ numero: z.string() }),
  body: z.object({
    files: z.array(fileTypeSchema),
  }),
  response: {
    200: z.void(),
  },
};
