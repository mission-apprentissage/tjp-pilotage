import type {Permission} from '../enum/permissionEnum';
import {PermissionEnum} from '../enum/permissionEnum';
import type  {PermissionScope } from '../enum/permissionScopeEnum';
import { PermissionScopeEnum } from '../enum/permissionScopeEnum';
import type { Role } from "../enum/roleEnum";
import { RoleEnum } from "../enum/roleEnum";

export type PermissionForRole = Partial<Record<Permission, PermissionScope>>;

export const PERMISSIONS = {
  admin: {
    [PermissionEnum["suivi-impact/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["pilotage-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["users/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["users/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes-région/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes-région/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir-statut/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir-avis/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  pilote: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["suivi-impact/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["pilotage-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  admin_region: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["pilotage-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["users/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["users/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["campagnes/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes-région/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["campagnes-région/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  region: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["pilotage-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  pilote_region: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["suivi-impact/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["pilotage-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  gestionnaire_region: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["pilotage-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  expert_region: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["pilotage-intentions/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  perdir: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["intentions-perdir/ecriture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  invite: {
    [PermissionEnum["intentions/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["restitution-intentions/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["intentions-perdir/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["intentions-perdir-statut/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["intentions-perdir-avis/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
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
