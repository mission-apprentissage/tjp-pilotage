import type { AvisTypeType } from "shared/enum/avisTypeEnum";
import type { UserFonction } from "shared/enum/userFonction";

export const FONCTIONS = {
  préalable: ["Région", "Région académique"],
  consultatif: [
    "Inspecteur",
    "DO CMQ",
    "Conseiller en formation professionnelle",
    "Coordonnateur de CFA-A",
    "DRAIO",
    "Services DOS",
    "DASEN",
    "Région",
    "DRAFPIC",
    "SGRA",
    "Recteur",
  ],
  final: ["Région", "CSA", "Recteur"],
} as Record<AvisTypeType, UserFonction[]>;
