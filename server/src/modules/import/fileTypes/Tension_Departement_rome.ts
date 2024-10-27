import { z } from "zod";

export const TensionDepartementRomeSchema = z.object({
  datMaj: z.string(),
  codeTypeTerritoire: z.string(),
  codeTerritoire: z.string(),
  libTerritoire: z.string(),
  codeTypeActivite: z.string(),
  codeActivite: z.string(),
  libActivite: z.string(),
  codeNomenclature: z.string(),
  libNomenclature: z.string(),
  codeTypePeriode: z.string(),
  codePeriode: z.string(),
  libPeriode: z.string(),
  valeurPrincipaleNom: z.string(),
});

export type Tension_Departement_Rome = z.infer<typeof TensionDepartementRomeSchema>;
