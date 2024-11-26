import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

export type RaisonCorrectionCampagne = keyof typeof RAISONS_CORRECTION_LABELS;
export type RaisonCorrectionLabel = keyof (typeof RAISONS_CORRECTION_LABELS)[RaisonCorrectionCampagne];

export const RAISONS_CORRECTION_LABELS = {
  "2023": {
    report: "Report du projet",
    annulation: "Annulation du projet",
    modification_capacite: "Modification de la capacité saisie initialement",
  },
  "2024": {
    report: "Report du projet",
    annulation: "Annulation du projet",
    modification_capacite: "Modification de la capacité saisie initialement",
  },
};

export const getRaisonCorrectionLabel = ({
  raison,
  campagne = CURRENT_ANNEE_CAMPAGNE,
}: {
  raison: RaisonCorrectionLabel;
  campagne?: RaisonCorrectionCampagne;
}): string => {
  return RAISONS_CORRECTION_LABELS[campagne][raison];
};

export const getRaisonsCampagne = (
  campagne: RaisonCorrectionCampagne = CURRENT_ANNEE_CAMPAGNE
): RaisonCorrectionLabel[] => {
  const raisonsCampagne = RAISONS_CORRECTION_LABELS[campagne];
  return Object.keys(raisonsCampagne) as RaisonCorrectionLabel[];
};
