import { TypeDemande } from "./typeDemandeUtils";

export type MotifLabel = keyof typeof MOTIFS_LABELS;

export const getMotifLabel = (motif: MotifLabel): string =>
  MOTIFS_LABELS[motif];

export const getMotifs = () => motifs;
export const getMotifsTypeDemande = (typeDemande: TypeDemande): MotifLabel[] =>
  getMotifs()[typeDemande];
export const getLabelsMotifsOuverture = () => motifsOuverture;
export const getLabelsMotifsFermeture = () => motifsFermeture;

export const MOTIFS_LABELS = {
  taux_insertion_satisfaisant: "Taux d’insertion satisfaisant",
  taux_poursuite_satisfaisant: "Taux de poursuite satisfaisant",
  taux_insertion_insatisfaisant: "Taux d’insertion insatisfaisant",
  taux_poursuite_insatisfaisant: "Taux de poursuite insatisfaisant",
  besoin_recrutement_local: "Besoins recrutements avérés localement",
  ouverture_plus_inserante: "Ouverture d’une formation plus insérante",
  repartition_autres_etablissements:
    "Répartition des élèves sur d’autres établissements",
  transfert_apprentissage: "Transfert vers l’apprentissage",
  recrutements_baisse: "Recrutements en baisse",
  capacite_trop_élevée_territoire: "Capacité trop élevée sur le territoire",
  locaux: "Locaux",
  cout_financier: "Coût financier",
  plateau_technique: "Plateau technique",
  metiers_2030: "Métiers 2030",
  projet_pedagogique_territorial: "Projet pédagogique territorial",
  maintien_specifique: "Maintien pour public spécifique",
  nouvel_etablissement: "Nouvel établissement",
  sauvegarde_metier_rare: "Sauvegarde métier rare",
  autre: "Autre motif (veuillez préciser)",
};

const motifsOuverture: MotifLabel[] = [
  "taux_insertion_satisfaisant",
  "taux_poursuite_satisfaisant",
  "besoin_recrutement_local",
  "metiers_2030",
  "projet_pedagogique_territorial",
  "nouvel_etablissement",
  "maintien_specifique",
  "sauvegarde_metier_rare",
  "autre",
];

const motifsFermeture: MotifLabel[] = [
  "taux_insertion_insatisfaisant",
  "taux_poursuite_insatisfaisant",
  "ouverture_plus_inserante",
  "repartition_autres_etablissements",
  "transfert_apprentissage",
  "recrutements_baisse",
  "capacite_trop_élevée_territoire",
  "locaux",
  "cout_financier",
  "plateau_technique",
  "autre",
];

const motifs: Record<TypeDemande, MotifLabel[]> = {
  ouverture_nette: motifsOuverture,
  ouverture_compensation: motifsOuverture,
  augmentation_nette: motifsOuverture,
  augmentation_compensation: motifsOuverture,
  fermeture: motifsFermeture,
  diminution: motifsFermeture,
};
