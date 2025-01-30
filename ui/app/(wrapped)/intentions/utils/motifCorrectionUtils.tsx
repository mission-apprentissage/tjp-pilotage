
export type AnneeCampagneMotifCorrection = keyof typeof MOTIFS_CORRECTION_LABELS;
export type MotifCorrectionLabel = keyof (typeof MOTIFS_CORRECTION_LABELS)[AnneeCampagneMotifCorrection];

export const MOTIFS_CORRECTION_LABELS = {
  "2023": {
    pb_equipement: "Problème d'équipement",
    pb_financement: "Problème de financement",
    pb_locaux: "Problème de locaux",
    defaillance_partenaire: "Défaillance d'un partenaire",
    trop_peu_eleves: "Trop peu d'élèves affectés",
    repartition_apprentissage_scolaire: "Nouvelle répartition apprentissage/scolaire",
    autre: "Autre motif (veuillez préciser)",
  },
  "2024": {
    pb_equipement: "Problème d'équipement",
    pb_financement: "Problème de financement",
    pb_locaux: "Problème de locaux",
    defaillance_partenaire: "Défaillance d'un partenaire",
    trop_peu_eleves: "Trop peu d'élèves affectés",
    repartition_apprentissage_scolaire: "Nouvelle répartition apprentissage/scolaire",
    autre: "Autre motif (veuillez préciser)",
  },
  "2025": {
    pb_equipement: "Problème d'équipement",
    pb_financement: "Problème de financement",
    pb_locaux: "Problème de locaux",
    defaillance_partenaire: "Défaillance d'un partenaire",
    trop_peu_eleves: "Trop peu d'élèves affectés",
    repartition_apprentissage_scolaire: "Nouvelle répartition apprentissage/scolaire",
    autre: "Autre motif (veuillez préciser)",
  }
};

export const getMotifCorrectionLabel = ({
  motifCorrection,
  anneeCampagne,
}: {
  motifCorrection: MotifCorrectionLabel;
  anneeCampagne: AnneeCampagneMotifCorrection;
}): string => {
  return MOTIFS_CORRECTION_LABELS[anneeCampagne][motifCorrection];
};

export const getMotifsParAnneeCampagne = (
  anneeCampagne: AnneeCampagneMotifCorrection
): MotifCorrectionLabel[] => {
  const motifsParAnneeCampagne = MOTIFS_CORRECTION_LABELS[anneeCampagne];
  return Object.keys(motifsParAnneeCampagne) as MotifCorrectionLabel[];
};

export const getMotifCorrectionOptionsParAnneeCampagne = (anneeCampagne: string) => {
  return Object.entries(MOTIFS_CORRECTION_LABELS[anneeCampagne as AnneeCampagneMotifCorrection]).map(
    ([value, label]) => ({
      value,
      label,
    }));
};
