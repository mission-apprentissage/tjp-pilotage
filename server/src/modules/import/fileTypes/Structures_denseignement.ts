import { z } from "zod";

export const StructureDenseignementSchema = z.object({
  '"code UAI"': z.string(),
  "type d'établissement": z.string(),
  nom: z.string(),
  "boîte postale": z.string(),
  adresse: z.string(),
  CP: z.string(),
  commune: z.string(),
  '"commune (COG)"': z.string(),
  téléphone: z.string(),
  département: z.string(),
  académie: z.string(),
  région: z.string(),
  '"latitude (Y)"': z.string(),
  '"longitude (X)"': z.string(),
  '"région (COG)"': z.string(),
});

export type StructureDenseignement = z.infer<
  typeof StructureDenseignementSchema
>;
