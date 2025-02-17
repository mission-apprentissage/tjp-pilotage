import type {Permission} from '../enum/permissionEnum';
import type  {PermissionScope } from '../enum/permissionScopeEnum';
import { PermissionScopeEnum } from '../enum/permissionScopeEnum';
import type { Role } from "../enum/roleEnum";
import { RoleEnum } from "../enum/roleEnum";

export type PermissionForRole = Partial<Record<Permission, PermissionScope>>;

export const PERMISSIONS = {
  admin: {
    "pilotage_reforme/lecture": PermissionScopeEnum["national"],
    "intentions/lecture": PermissionScopeEnum["national"],
    "intentions/ecriture": PermissionScopeEnum["national"],
    "restitution-intentions/lecture": PermissionScopeEnum["national"],
    "pilotage-intentions/lecture": PermissionScopeEnum["national"],
    "users/lecture": PermissionScopeEnum["national"],
    "users/ecriture": PermissionScopeEnum["national"],
    "campagnes/lecture": PermissionScopeEnum["national"],
    "campagnes/ecriture": PermissionScopeEnum["national"],
    "campagnes-région/ecriture": PermissionScopeEnum["national"],
    "campagnes-région/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/ecriture": PermissionScopeEnum["national"],
    "intentions-perdir-statut/ecriture": PermissionScopeEnum["national"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["national"],
    "intentions-perdir-avis/ecriture": PermissionScopeEnum["national"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  pilote: {
    "intentions/lecture": PermissionScopeEnum["national"],
    "pilotage_reforme/lecture": PermissionScopeEnum["national"],
    "restitution-intentions/lecture": PermissionScopeEnum["national"],
    "pilotage-intentions/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/lecture": PermissionScopeEnum["national"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["national"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  admin_region: {
    "intentions/lecture": PermissionScopeEnum["région"],
    "intentions/ecriture": PermissionScopeEnum["région"],
    "restitution-intentions/lecture": PermissionScopeEnum["national"],
    "pilotage-intentions/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/lecture": PermissionScopeEnum["région"],
    "intentions-perdir/ecriture": PermissionScopeEnum["région"],
    "users/lecture": PermissionScopeEnum["région"],
    "users/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["région"],
    "campagnes/lecture": PermissionScopeEnum["national"],
    "campagnes-région/ecriture": PermissionScopeEnum["région"],
    "campagnes-région/lecture": PermissionScopeEnum["région"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  region: {
    "intentions/lecture": PermissionScopeEnum["région"],
    "restitution-intentions/lecture": PermissionScopeEnum["région"],
    "pilotage-intentions/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/lecture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["région"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  pilote_region: {
    "intentions/lecture": PermissionScopeEnum["région"],
    "intentions/ecriture": PermissionScopeEnum["région"],
    "restitution-intentions/lecture": PermissionScopeEnum["national"],
    "pilotage-intentions/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/lecture": PermissionScopeEnum["région"],
    "intentions-perdir/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["région"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  gestionnaire_region: {
    "intentions/lecture": PermissionScopeEnum["région"],
    "intentions/ecriture": PermissionScopeEnum["région"],
    "restitution-intentions/lecture": PermissionScopeEnum["région"],
    "pilotage-intentions/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/lecture": PermissionScopeEnum["région"],
    "intentions-perdir/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["région"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  expert_region: {
    "intentions/lecture": PermissionScopeEnum["région"],
    "restitution-intentions/lecture": PermissionScopeEnum["région"],
    "pilotage-intentions/lecture": PermissionScopeEnum["national"],
    "intentions-perdir/lecture": PermissionScopeEnum["région"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/ecriture": PermissionScopeEnum["région"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["région"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  perdir: {
    "intentions/lecture": PermissionScopeEnum["uai"],
    "intentions-perdir/lecture": PermissionScopeEnum["uai"],
    "intentions-perdir/ecriture": PermissionScopeEnum["uai"],
    "restitution-intentions/lecture": PermissionScopeEnum["uai"],
    "pilotage-intentions/lecture": PermissionScopeEnum["uai"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["uai"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["uai"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
  invite: {
    "intentions/lecture": PermissionScopeEnum["role"],
    "restitution-intentions/lecture": PermissionScopeEnum["role"],
    "intentions-perdir/lecture": PermissionScopeEnum["role"],
    "intentions-perdir-statut/lecture": PermissionScopeEnum["role"],
    "intentions-perdir-avis/lecture": PermissionScopeEnum["role"],
    "enregistrement-requete/lecture": PermissionScopeEnum["national"],
    "enregistrement-requete/ecriture": PermissionScopeEnum["national"],
  },
} satisfies Record<
  Role,
  PermissionForRole
>;

export const HIERARCHY: {
  [key in Role]: {
    sub: Array<Role>;
    scope: PermissionScope;
  };
} = {
  admin: {
    sub: Object.keys(PERMISSIONS) as Array<Role>,
    scope: PermissionScopeEnum["national"],
  },
  pilote: {
    sub: [],
    scope: PermissionScopeEnum["national"],
  },
  admin_region: {
    sub: [
      RoleEnum["gestionnaire_region"],
      RoleEnum["pilote_region"],
      RoleEnum["expert_region"],
      RoleEnum["region"],
      RoleEnum["invite"]
    ],
    scope: PermissionScopeEnum["région"],
  },
  region: {
    sub: [],
    scope: PermissionScopeEnum["région"],
  },
  pilote_region: {
    sub: [],
    scope: PermissionScopeEnum["région"],
  },
  gestionnaire_region: {
    sub: [],
    scope: PermissionScopeEnum["région"],
  },
  expert_region: {
    sub: [],
    scope: PermissionScopeEnum["région"],
  },
  perdir: {
    sub: [],
    scope: PermissionScopeEnum["uai"],
  },
  invite: {
    sub: [],
    scope: PermissionScopeEnum["région"],
  },
};
