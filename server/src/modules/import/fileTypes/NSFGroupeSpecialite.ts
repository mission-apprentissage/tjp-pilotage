import { z } from "zod";

export const NSFGroupeSpecialiteSchema = z.object({
  GROUPE_SPECIALITE: z.string(),
  DOMAINE_SPECIALITE: z.string(),
  LIBELLE_COURT: z.string(),
  LIBELLE_LONG: z.string(),
  LIBELLE_STAT_33: z.string(),
  DATE_OUVERTURE: z.string(),
  DATE_FERMETURE: z.string(),
  DATE_INTERVENTION: z.string(),
  LIBELLE_EDITION: z.string(),
  N_COMMENTAIRE: z.string(),
});

export type NSF_Groupe_Specialite = z.infer<typeof NSFGroupeSpecialiteSchema>;
