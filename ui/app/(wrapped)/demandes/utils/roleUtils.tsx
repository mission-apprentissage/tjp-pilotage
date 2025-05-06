import type {Role} from 'shared';
import { RoleEnum} from 'shared';

export const formatRole = (role: Role): string => {
  switch (role) {
  case RoleEnum["admin"]:
    return "Administrateur";
  case RoleEnum["pilote"]:
    return "Pilote";
  case RoleEnum["pilote_region"]:
    return "Pilote région";
  case RoleEnum["gestionnaire_region"]:
    return "Gestionnaire région";
  case RoleEnum["region"]:
    return "Utilisateur région";
  case RoleEnum["expert_region"]:
    return "Gestionnaire région";
  case RoleEnum["admin_region"]:
    return "Admin région";
  case RoleEnum["perdir"]:
    return "Perdir";
  case RoleEnum["invite"]:
    return "Invité";
  default:
    return "";
  }
};
