import type { AvisTypeType } from "shared/enum/avisTypeEnum";

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
} as Record<AvisTypeType, string[]>;
