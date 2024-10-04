import { z } from "zod";

export const DomaineProfessionnelSchema = z.object({
  code_domaine_professionnel: z.string(),
  libelle_domaine_professionnel: z.string(),
});

export type Domaine_Professionnel = z.infer<typeof DomaineProfessionnelSchema>;
