import { z } from "zod";

export const StructureDenseignementSchema = z.object({
  '"code UAI"': z.string(),
  "type d'établissement": z.string().optional(),
  nom: z.string().optional(),
  "boîte postale": z.string().optional(),
  adresse: z.string().optional(),
  CP: z.string().optional(),
  commune: z.string().optional(),
  '"commune (COG)"': z.string().optional(),
  téléphone: z.string().optional(),
  département: z.string().optional(),
  académie: z.string().optional(),
  région: z.string().optional(),
  '"latitude (Y)"': z.string(),
  '"longitude (X)"': z.string(),
  '"région (COG)"': z.string().optional(),
});

export type StructureDenseignement = z.infer<typeof StructureDenseignementSchema>;
