import { z } from "zod";

export const NSFCategorieSpecialiteSchema = z.object({
  CATEGORIE_SPECIALITE: z.string(),
  LIBELLE_COURT: z.string(),
  LIBELLE_LONG: z.string(),
  LIBELLE_STAT_33: z.string(),
  LIBELLE_STAT_3: z.string(),
  DATE_OUVERTURE: z.string(),
  DATE_FERMETURE: z.string(),
  DATE_INTERVENTION: z.string(),
  N_COMMENTAIRE: z.string(),
});

export type NSF_Categorie_Specialite = z.infer<typeof NSFCategorieSpecialiteSchema>;
