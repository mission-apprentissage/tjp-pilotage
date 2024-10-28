import type { Role } from "shared";

export const formatRole = (role: Role): string => {
  switch (role) {
    case "admin":
      return "Administrateur";
    case "pilote":
      return "Pilote";
    case "pilote_region":
      return "Pilote région";
    case "gestionnaire_region":
      return "Gestionnaire région";
    case "region":
      return "Utilisateur région";
    case "expert_region":
      return "Gestionnaire région";
    case "admin_region":
      return "Admin région";
    case "perdir":
      return "Perdir";
    case "invite":
      return "Invité";
    default:
      return "";
  }
};
