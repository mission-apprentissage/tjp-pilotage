

export type AnneeCampagneRaisonCorrection = keyof typeof RAISONS_CORRECTION_LABELS;
export type RaisonCorrectionLabel = keyof (typeof RAISONS_CORRECTION_LABELS)[AnneeCampagneRaisonCorrection];

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
  "2025": {
    report: "Report du projet",
    annulation: "Annulation du projet",
    modification_capacite: "Modification de la capacité saisie initialement",
  },
};

export const getRaisonCorrectionLabelParAnneeCampagne = ({
  raison,
  anneeCampagne,
}: {
  raison: RaisonCorrectionLabel;
  anneeCampagne: AnneeCampagneRaisonCorrection;
}): string => {
  return RAISONS_CORRECTION_LABELS[anneeCampagne][raison];
};

export const getRaisonsCorrectionParAnneeCampagne = (
  anneeCampagne: AnneeCampagneRaisonCorrection
): RaisonCorrectionLabel[] => {
  const raisonsCampagne = RAISONS_CORRECTION_LABELS[anneeCampagne];
  return Object.keys(raisonsCampagne) as RaisonCorrectionLabel[];
};

export const getRaisonCorrectionOptionsParAnneeCampagne = (anneeCampagne: string) => {
  return Object.entries(RAISONS_CORRECTION_LABELS[anneeCampagne as AnneeCampagneRaisonCorrection]).map(
    ([value, label]) => ({
      value,
      label,
    }));
};
