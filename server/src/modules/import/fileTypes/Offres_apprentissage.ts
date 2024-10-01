import { z } from "zod";

export const OffresApprentissageSchema = z.object({
  "UAI formation": z.string(),
  "UAI Responsable": z.string(),
  "UAI formateur": z.string(),
  "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)":
    z.string(),
  "Niveau de la formation": z.string(),
  Tags: z.string(),
});

export type Offres_apprentissage = z.infer<typeof OffresApprentissageSchema>;
