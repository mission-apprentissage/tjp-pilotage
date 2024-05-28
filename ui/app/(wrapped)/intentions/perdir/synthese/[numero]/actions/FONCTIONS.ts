import { AvisTypeType } from "shared/enum/avisTypeEnum";

export const FONCTIONS = {
  préalable: ["région", "région académique"],
  consultatif: [
    "inspecteur",
    "inspecteur IEN",
    "inspecteur IA/IPR",
    "DO CMQ",
    "conseiller en formation professionnelle",
    "coordonnateur de CFA-A",
    "DRAIO",
    "services DOS",
    "DASEN",
    "région",
    "région académique",
  ],
  final: ["DRAIO", "services DOS", "DASEN", "région", "région académique"],
} as Record<AvisTypeType, string[]>;
