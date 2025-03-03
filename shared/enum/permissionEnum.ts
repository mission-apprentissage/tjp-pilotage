import { z } from "zod";


export const permissionZodType = z.enum([
  "suivi-impact/lecture",
  "intentions/lecture",
  "intentions/ecriture",
  "restitution-intentions/lecture",
  "pilotage-intentions/lecture",
  "users/lecture",
  "users/ecriture",
  "campagnes/lecture",
  "campagnes/ecriture",
  "campagnes-région/ecriture",
  "campagnes-région/lecture",
  "intentions-perdir/lecture",
  "intentions-perdir/ecriture",
  "intentions-perdir-statut/ecriture",
  "intentions-perdir-statut/lecture",
  "intentions-perdir-avis/ecriture",
  "intentions-perdir-avis/lecture",
  "enregistrement-requete/lecture",
  "enregistrement-requete/ecriture",
]);

export const PermissionEnum = permissionZodType.Enum;

export type Permission = z.infer<typeof permissionZodType>;
