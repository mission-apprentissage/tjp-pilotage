import { z } from "zod";

export const EditoContentSchema = z.object({
  id: z.string(),
  message: z.string().optional(),
  titre: z.string().optional(),
  lien: z.string().optional(),
  en_ligne: z.string().optional(),
  date_creation: z.string().optional(),
  order: z.string().optional(),
  region: z.string().optional(),
});
export type EditoEntry = z.infer<typeof EditoContentSchema>;

export const getEditoSchema = {
  response: {
    200: z.array(EditoContentSchema),
  },
};
