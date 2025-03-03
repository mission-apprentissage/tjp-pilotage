import type { RaisonCorrectionType } from "shared/enum/raisonCorrectionEnum";

export const castRaisonCorrection = (raison?: string | null): RaisonCorrectionType => {
  return raison as RaisonCorrectionType;
};
