import { z } from "zod";

export const searchDiplomeSchema = {
  params: z.object({
    search: z.string(),
  }),
  response: {
    200: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        isSpecialite: z.coerce.boolean(),
        isOption: z.coerce.boolean(),
        isFCIL: z.boolean(),
        dateFermeture: z.string().optional(),
        dispositifs: z
          .array(
            z.object({
              codeDispositif: z.string().optional(),
              libelleDispositif: z.string().optional(),
            })
          )
          .optional(),
      })
    ),
  },
};
