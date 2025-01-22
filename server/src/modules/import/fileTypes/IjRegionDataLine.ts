import { z } from "zod";

export const IjRegionDataSchema = z.object({
  id: z.string(),
  millesime: z.string(),
  code_region_ij: z.string(),
  code_region: z.string(),
  voie: z.enum(["scolaire", "apprentissage"]),
  cfd: z.string().optional(),
  mefstat11: z.string().optional(),
  nb_annee_term: z.number(),
  nb_en_emploi_12_mois: z.number(),
  nb_en_emploi_18_mois: z.number(),
  nb_en_emploi_24_mois: z.number(),
  nb_en_emploi_6_mois: z.number(),
  nb_poursuite_etudes: z.number(),
  nb_sortant: z.number(),
  taux_emploi_12_mois: z.number(),
  taux_emploi_18_mois: z.number(),
  taux_emploi_24_mois: z.number(),
  taux_emploi_6_mois: z.number(),
  taux_poursuite_etudes: z.number(),
});

export type IjRegionDataLine = z.infer<typeof IjRegionDataSchema>;
