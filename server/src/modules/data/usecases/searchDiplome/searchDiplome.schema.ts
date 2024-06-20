import { z } from "zod";

export const searchDiplomeSchema = {
  params: z.object({
    search: z.string(),
  }),
  querystring: z.object({
    codeNsf: z.string().optional(),
  }),
  response: {
    200: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        isSpecialite: z.coerce.boolean(),
        isOption: z.coerce.boolean(),
        is1ereCommune: z.coerce.boolean(),
        is2ndeCommune: z.coerce.boolean(),
        isFCIL: z.coerce.boolean(),
        dateFermeture: z.string().optional(),
        libelleFormation: z.string(),
        libelleNiveauDiplome: z.string().optional(),
        cfd: z.string(),
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
