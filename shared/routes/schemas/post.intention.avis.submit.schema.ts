import { z } from "zod";

import { AvisStatutZodType } from "../../enum/avisStatutEnum";
import { AvisTypeZodType } from "../../enum/avisTypeEnum";
import { unEscapeString } from "../../utils/escapeString";

export const submitAvisSchema = {
  body: z.object({
    avis: z.object({
      intentionNumero: z.string(),
      statutAvis: AvisStatutZodType,
      typeAvis: AvisTypeZodType,
      commentaire: z
        .string()
        .optional()
        .transform((commentaire) => unEscapeString(commentaire)),
      userFonction: z.string().optional(),
      isVisibleParTous: z.boolean(),
      createdAt: z.string().optional(),
      createdBy: z.string().optional(),
      updatedBy: z.string().optional(),
    }),
  }),
  response: {
    200: z.object({
      id: z.string(),
      intentionNumero: z.string(),
      statutAvis: AvisStatutZodType,
      typeAvis: AvisTypeZodType,
      commentaire: z.string().optional(),
      userFonction: z.string().optional(),
      isVisibleParTous: z.boolean(),
      createdBy: z.string().optional(),
      updatedBy: z.string().optional(),
    }),
  },
};
