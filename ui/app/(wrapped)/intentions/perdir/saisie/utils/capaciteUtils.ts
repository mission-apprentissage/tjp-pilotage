import type { DemandeType } from "shared/enum/demandeTypeEnum";

import {
  isTypeAugmentation,
  isTypeDiminution,
  isTypeFermeture,
  isTypeOuverture,
} from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

export const capaciteDoitEtreInferieure = (typeDemande: DemandeType) =>
  isTypeFermeture(typeDemande) || isTypeDiminution(typeDemande);

export const capaciteDoitEtreSuperieure = (typeDemande: DemandeType) =>
  isTypeAugmentation(typeDemande) || isTypeOuverture(typeDemande);
