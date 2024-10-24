import { z } from "zod";

export const CertifInfoSchema = z.object({
  Code_Diplome: z.string().optional(),
  Libelle_Diplome: z.string().optional(),
  Libelle_Type_Diplome: z.string().optional(),
  Code_Niveau_Europeen: z.string().optional(),
  Date_MaJ: z.string().optional(),
  Code_FormaCode: z.string().optional(),
  Libelle_FormaCode: z.string().optional(),
  Code_Rome_1: z.string(),
  Code_Rome_2: z.string().optional(),
  Code_Rome_3: z.string().optional(),
  Code_Rome_4: z.string().optional(),
  Code_Rome_5: z.string().optional(),
  Code_Nsf: z.string().optional(),
  Code_RNCP: z.string().optional(),
  Code_RS: z.string().optional(),
  Code_Scolarité: z.string(),
  valideur: z.string().optional(),
  certificateur: z.string().optional(),
  Annee_Premiere_Session: z.string().optional(),
  Annee_Derniere_Session: z.string().optional(),
  Code_Ancien_Diplome: z.string().optional(),
  Intitulé_Ancien_Diplome: z.string().optional(),
  Code_Ancien_RNCP: z.string().optional(),
  Code_Ancien_Scolarité: z.string().optional(),
  Options: z.string().optional(),
  Etat: z.string().optional(),
  Etat_Libelle: z.string().optional(),
  Etat_Ancien_Diplome: z.string().optional(),
  Etat_Ancien_Diplome_Libelle: z.string().optional(),
  accessibilite_fi: z.string().optional(),
  accessibilite_ca: z.string().optional(),
  accessibilite_fc: z.string().optional(),
  accessibilite_cp: z.string().optional(),
  accessibilite_vae: z.string().optional(),
  accessibilite_ind: z.string().optional(),
  code_type_diplome: z.string().optional(),
  codeIdeo2: z.string().optional(),
});

export type Certif_Info = z.infer<typeof CertifInfoSchema>;
