import type { AvisStatutType } from "shared/enum/avisStatutEnum";

export const castAvisStatut = (statutAvis?: string | null): AvisStatutType => {
  return statutAvis as AvisStatutType;
};
