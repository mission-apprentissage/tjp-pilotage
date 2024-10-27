import { z } from "zod";

export const DiplomeProfessionnelSchema = z.object({
  "Code diplôme": z.string().optional(),
  "Intitulé de la spécialité (et options)": z.string(),
  "Code RNCP": z.string().optional(),
  "Première session": z.string(),
  "Dernière session": z.string().optional(),
  Diplôme: z.string(),
  "Commission professionnelle consultative": z.string().optional(),
  Secteur: z.string().optional(),
  "Sous-secteur": z.string().optional(),
});

export type DiplomeProfessionnelLine = z.infer<typeof DiplomeProfessionnelSchema>;
