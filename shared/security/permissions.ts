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
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["pilotage/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["users/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["users/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes-région/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes-région/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande-statut/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande-avis/ecriture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  pilote: {
    [PermissionEnum["suivi-impact/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["pilotage/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  admin_region: {
    [PermissionEnum["pilotage/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["users/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["users/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["campagnes/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["campagnes-région/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["campagnes-région/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  region: {
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["pilotage/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  pilote_region: {
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["suivi-impact/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["pilotage/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  gestionnaire_region: {
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["pilotage/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  expert_region: {
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["pilotage/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/ecriture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["région"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  perdir: {
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["demande/ecriture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["uai"],
    [PermissionEnum["enregistrement-requete/lecture"]]: PermissionScopeEnum["national"],
    [PermissionEnum["enregistrement-requete/ecriture"]]: PermissionScopeEnum["national"],
  },
  invite: {
    [PermissionEnum["restitution/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["demande/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["demande-statut/lecture"]]: PermissionScopeEnum["role"],
    [PermissionEnum["demande-avis/lecture"]]: PermissionScopeEnum["role"],
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
