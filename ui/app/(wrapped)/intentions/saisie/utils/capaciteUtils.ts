import {
  isTypeAugmentation,
  isTypeDiminution,
  isTypeFermeture,
  isTypeOuverture,
} from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const capaciteDoitEtreInferieure = (typeDemande: string) =>
  isTypeFermeture(typeDemande) || isTypeDiminution(typeDemande);

export const capaciteDoitEtreSuperieure = (typeDemande: string) =>
  isTypeAugmentation(typeDemande) || isTypeOuverture(typeDemande);
