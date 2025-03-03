import type { DemandeTypeType } from "shared/enum/demandeTypeEnum";

export const castTypeDemande = (typeDemande?: string | null): DemandeTypeType => {
  return typeDemande as DemandeTypeType;
};
