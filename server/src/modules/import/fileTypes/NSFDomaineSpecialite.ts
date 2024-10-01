import { z } from "zod";

export const NSFDomaineSpecialiteSchema = z.object({
  DOMAINE_SPECIALITE: z.string(),
  CATEGORIE_SPECIALITE: z.string(),
  LIBELLE_COURT: z.string(),
  LIBELLE_LONG: z.string(),
  LIBELLE_STAT_33: z.string(),
  DATE_OUVERTURE: z.string(),
  DATE_FERMETURE: z.string(),
  DATE_INTERVENTION: z.string(),
  N_COMMENTAIRE: z.string(),
});

export type NSF_Domaine_Specialite = z.infer<typeof NSFDomaineSpecialiteSchema>;
