import { z } from "zod";

export const AttractiviteCapaciteSchema = z.object({
  "Etablissement d’accueil": z.string(),
  "MEF STAT 11": z.string(),
  "Voeu de recensement O/N": z.string(),
  "Statut Offre de formation": z.string(),
  "Capacité carte scolaire": z.string(),
  "Demandes vœux 1": z.string(),
});

export type Attractivite_capacite = z.infer<typeof AttractiviteCapaciteSchema>;
