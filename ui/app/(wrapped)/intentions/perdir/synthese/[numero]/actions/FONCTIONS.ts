import type { AvisTypeType } from "shared/enum/avisTypeEnum";
import type { UserFonction } from "shared/enum/userFonction";

export const FONCTIONS = {
  préalable: ["région", "région académique"],
  consultatif: [
    "inspecteur",
    "DO CMQ",
    "conseiller en formation professionnelle",
    "coordonnateur de CFA-A",
    "DRAIO",
    "services DOS",
    "DASEN",
    "région",
    "DRAFPIC",
    "SGRA",
    "recteur",
  ],
  final: ["région", "CSA", "recteur"],
} as Record<AvisTypeType, UserFonction[]>;
