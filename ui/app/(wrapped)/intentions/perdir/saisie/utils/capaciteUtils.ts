import {
  isTypeAugmentation,
  isTypeDiminution,
  isTypeFermeture,
  isTypeOuverture,
} from "../../../utils/typeDemandeUtils";

export const capaciteDoitEtreInferieure = (typeDemande: string) =>
  isTypeFermeture(typeDemande) || isTypeDiminution(typeDemande);

export const capaciteDoitEtreSuperieure = (typeDemande: string) =>
  isTypeAugmentation(typeDemande) || isTypeOuverture(typeDemande);
