import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

export type MotifCorrectionCampagne = keyof typeof MOTIFS_CORRECTION_LABELS;
export type MotifCorrectionLabel = keyof (typeof MOTIFS_CORRECTION_LABELS)[MotifCorrectionCampagne];

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
  campagne = CURRENT_ANNEE_CAMPAGNE,
}: {
  motifCorrection: MotifCorrectionLabel;
  campagne?: MotifCorrectionCampagne;
}): string => {
  return MOTIFS_CORRECTION_LABELS[campagne][motifCorrection];
};

export const getMotifsCampagne = (
  campagne: MotifCorrectionCampagne = CURRENT_ANNEE_CAMPAGNE
): MotifCorrectionLabel[] => {
  const motifsCampagne = MOTIFS_CORRECTION_LABELS[campagne];
  return Object.keys(motifsCampagne) as MotifCorrectionLabel[];
};
