import { z } from "zod";

export const LyceesACCESchema = z.object({
  numero_uai: z.string(),
  numero_siren_siret_uai: z.string(),
  academie: z.string(),
  nature_uai: z.string(),
  appellation_officielle: z.string(),
  commune: z.string(),
  commune_libe: z.string(),
  adresse_uai: z.string(),
  code_postal_uai: z.string(),
  coordonnee_x: z.string().optional(),
  coordonnee_y: z.string().optional(),
  secteur_public_prive: z.string(),
  date_ouverture: z.string(),
  date_fermeture: z.string(),
  ministere_tutelle: z.string(),
  departement_insee_3: z.string().optional(),
  type_uai: z.string(),
});

export type LyceesACCELine = z.infer<typeof LyceesACCESchema>;
