import { AvisStatutZodType } from "shared/enum/avisStatutEnum";
import { AvisTypeZodType } from "shared/enum/avisTypeEnum";
import { z } from "zod";

export const submitAvisSchema = {
  body: z.object({
    avis: z.object({
      intentionNumero: z.string(),
      statutAvis: AvisStatutZodType,
      typeAvis: AvisTypeZodType,
      commentaire: z.string().optional(),
      userFonction: z.string().optional(),
      isVisibleParTous: z.boolean(),
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
