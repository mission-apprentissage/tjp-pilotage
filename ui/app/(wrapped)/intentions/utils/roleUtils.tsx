import { Role } from "shared";

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
    case "perdir":
      return "Perdir";
    default:
      return "";
  }
};
