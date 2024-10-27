import type { AvisTypeType } from "shared/enum/avisTypeEnum";

export const castAvisType = (typeAvis?: string | null): AvisTypeType => {
  return typeAvis as AvisTypeType;
};
