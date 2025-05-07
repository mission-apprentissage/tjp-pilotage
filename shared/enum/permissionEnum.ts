import { z } from "zod";


export const permissionZodType = z.enum([
  "suivi-impact/lecture",
  "restitution/lecture",
  "pilotage/lecture",
  "users/lecture",
  "users/ecriture",
  "campagnes/lecture",
  "campagnes/ecriture",
  "campagnes-région/ecriture",
  "campagnes-région/lecture",
  "demande/lecture",
  "demande/ecriture",
  "demande-statut/ecriture",
  "demande-statut/lecture",
  "demande-avis/ecriture",
  "demande-avis/lecture",
  "enregistrement-requete/lecture",
  "enregistrement-requete/ecriture",
]);

export const PermissionEnum = permissionZodType.Enum;

export type Permission = z.infer<typeof permissionZodType>;
