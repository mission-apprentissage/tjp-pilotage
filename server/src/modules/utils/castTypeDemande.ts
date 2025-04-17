import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";

export const castTypeDemande = (typeDemande?: string | null): TypeDemandeType => {
  return typeDemande as TypeDemandeType;
};
