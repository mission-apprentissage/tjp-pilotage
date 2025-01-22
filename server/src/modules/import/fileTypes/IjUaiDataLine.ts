import { z } from "zod";

export const IjUaiDataSchema = z.object({
  id: z.string(),
  millesime: z.string(),
  code_region_ij: z.string(),
  code_region: z.string(),
  uai: z.string(),
  voie: z.enum(["scolaire", "apprentissage","ensemble"]),
  cfd: z.string().optional(),
  mefstat: z.string().optional(),
  ensemble: z.enum(["apprentis", "ensemble", "voieprosco"]).optional(),
  nb_annee_term: z.number().optional(),
  nb_en_emploi_12_mois: z.number().optional(),
  nb_en_emploi_18_mois: z.number().optional(),
  nb_en_emploi_24_mois: z.number().optional(),
  nb_en_emploi_6_mois: z.number().optional(),
  nb_poursuite_etudes: z.number().optional(),
  nb_sortant: z.number().optional(),
  taux_emploi_12_mois: z.number().optional(),
  taux_emploi_18_mois: z.number().optional(),
  taux_emploi_24_mois: z.number().optional(),
  taux_emploi_6_mois: z.number().optional(),
  taux_poursuite_etudes: z.number().optional(),
  valeur_ajoutee_6_mois: z.number().optional(),
});

export type IjUaiDataLine = z.infer<typeof IjUaiDataSchema>;
