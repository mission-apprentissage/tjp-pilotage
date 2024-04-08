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
  besoins_economiques_locaux: "Besoins économiques avérés localement",
  besoins_economiques_en_baisse: "Besoins économiques en baisse",
  ouverture_plus_inserante: "Ouverture d’une formation plus insérante",
  repartition_autres_etablissements:
    "Répartition des élèves sur d’autres établissements",
  recrutements_baisse: "Recrutements en baisse",
  capacite_trop_élevée_territoire: "Capacité trop élevée sur le territoire",
  nombre_eleves_en_baisse: "Baisse du nombre d'élèves dans la formation",
  locaux: "Locaux",
  cout_financier: "Coût financier",
  plateau_technique: "Plateau technique",
  metiers_2030: "Métiers 2030",
  projet_pedagogique_territorial: "Projet pédagogique territorial",
  maintien_specifique: "Maintien pour public spécifique",
  nouvel_etablissement: "Nouvel établissement",
  sauvegarde_metier_rare: "Sauvegarde métier rare",
  effectif_faible_scolaire: "Effectif trop faible en voie scolaire",
  mixite_peu_attractive: "Mixité peu attractive",
  insertion_professionnelle_insuffisante:
    "Insertion professionnelle insuffisante",
  formation_situation_fragilite: "Formation en situation de fragilité",
  disponibilite_fonciere_insuffisante: "Disponibilité foncière insuffisante",
  autre: "Autre motif (veuillez préciser)",
};

const motifsOuverture: MotifLabel[] = [
  "taux_insertion_satisfaisant",
  "taux_poursuite_satisfaisant",
  "besoins_economiques_locaux",
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
  "recrutements_baisse",
  "capacite_trop_élevée_territoire",
  "locaux",
  "cout_financier",
  "plateau_technique",
  "nombre_eleves_en_baisse",
  "besoins_economiques_en_baisse",
  "autre",
];

const motifsTransfert: MotifLabel[] = [
  "effectif_faible_scolaire",
  "mixite_peu_attractive",
  "insertion_professionnelle_insuffisante",
  "formation_situation_fragilite",
  "disponibilite_fonciere_insuffisante",
  "autre",
];

const motifs: Record<TypeDemande, MotifLabel[]> = {
  ouverture_nette: motifsOuverture,
  augmentation_nette: motifsOuverture,
  fermeture: motifsFermeture,
  diminution: motifsFermeture,
  transfert: motifsTransfert,
};
