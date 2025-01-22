import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import type { TypeDemande } from "./typeDemandeUtils";

export type MotifCampagne = keyof typeof MOTIFS_LABELS;
export type MotifLabel = keyof (typeof MOTIFS_LABELS)[MotifCampagne];

export const MOTIFS_LABELS = {
  "2023": {
    taux_insertion_satisfaisant: "Taux d’insertion satisfaisant",
    taux_poursuite_satisfaisant: "Taux de poursuite satisfaisant",
    taux_insertion_insatisfaisant: "Taux d’insertion insatisfaisant",
    taux_poursuite_insatisfaisant: "Taux de poursuite insatisfaisant",
    besoin_recrutement_local: "Besoins recrutements avérés localement",
    ouverture_plus_inserante: "Ouverture d’une formation plus insérante",
    repartition_autres_etablissements: "Répartition des élèves sur d’autres établissements",
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
    ajustement_rentree: "Ajustement de rentrée",
    autre: "Autre motif (veuillez préciser)",
  },
  "2024": {
    taux_insertion_satisfaisant: "Taux d’insertion satisfaisant",
    taux_poursuite_satisfaisant: "Taux de poursuite satisfaisant",
    taux_insertion_insatisfaisant: "Taux d’insertion insatisfaisant",
    taux_poursuite_insatisfaisant: "Taux de poursuite insatisfaisant",
    besoins_economiques_locaux: "Besoins économiques avérés localement",
    besoins_economiques_en_baisse: "Besoins économiques en baisse",
    ouverture_plus_inserante: "Ouverture d’une formation plus insérante",
    repartition_autres_etablissements: "Répartition des élèves sur d’autres établissements",
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
    insertion_professionnelle_insuffisante: "Insertion professionnelle insuffisante",
    formation_situation_fragilite: "Formation en situation de fragilité",
    disponibilite_fonciere_insuffisante: "Disponibilité foncière insuffisante",
    perspective_insertion_professionnelle: "Perspectives d’insertion professionnelle",
    mise_en_place_partenariat: "Mise en place ou poursuite d’un partenariat (préciser en commentaire)",
    favorise_attractivite_formation: "Favorise l’attractivité de la formation",
    projet_specifique_local: "Projet spécifique local",
    ajustement_rentree: "Ajustement de rentrée",
    autre: "Autre motif (veuillez préciser)",
  },
  "2025": {
    taux_insertion_satisfaisant: "Taux d’insertion satisfaisant",
    taux_poursuite_satisfaisant: "Taux de poursuite satisfaisant",
    taux_insertion_insatisfaisant: "Taux d’insertion insatisfaisant",
    taux_poursuite_insatisfaisant: "Taux de poursuite insatisfaisant",
    besoins_economiques_locaux: "Besoins économiques avérés localement",
    besoins_economiques_en_baisse: "Besoins économiques en baisse",
    ouverture_plus_inserante: "Ouverture d’une formation plus insérante",
    repartition_autres_etablissements: "Répartition des élèves sur d’autres établissements",
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
    insertion_professionnelle_insuffisante: "Insertion professionnelle insuffisante",
    formation_situation_fragilite: "Formation en situation de fragilité",
    disponibilite_fonciere_insuffisante: "Disponibilité foncière insuffisante",
    perspective_insertion_professionnelle: "Perspectives d’insertion professionnelle",
    mise_en_place_partenariat: "Mise en place ou poursuite d’un partenariat (préciser en commentaire)",
    favorise_attractivite_formation: "Favorise l’attractivité de la formation",
    projet_specifique_local: "Projet spécifique local",
    ajustement_rentree: "Ajustement de rentrée",
    autre: "Autre motif (veuillez préciser)",
  },
};

const motifsOuverture = [
  "taux_insertion_satisfaisant",
  "taux_poursuite_satisfaisant",
  "besoins_economiques_locaux",
  "metiers_2030",
  "projet_pedagogique_territorial",
  "nouvel_etablissement",
  "maintien_specifique",
  "sauvegarde_metier_rare",
  "autre",
] as MotifLabel[];

const motifsFermeture = [
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
] as MotifLabel[];

const motifsTransfert = [
  "effectif_faible_scolaire",
  "mixite_peu_attractive",
  "insertion_professionnelle_insuffisante",
  "formation_situation_fragilite",
  "disponibilite_fonciere_insuffisante",
  "autre",
] as MotifLabel[];

const motifsColoration = [
  "perspective_insertion_professionnelle",
  "mise_en_place_partenariat",
  "favorise_attractivite_formation",
  "projet_specifique_local",
  "autre",
] as MotifLabel[];

const motifsAjustement = ["ajustement_rentree"] as MotifLabel[];

const motifsTriggerAutre = ["autre", "mise_en_place_partenariat"] as MotifLabel[];

const motifs: Record<TypeDemande, MotifLabel[]> = {
  ouverture_nette: motifsOuverture,
  augmentation_nette: motifsOuverture,
  fermeture: motifsFermeture,
  diminution: motifsFermeture,
  transfert: motifsTransfert,
  coloration: motifsColoration,
  ajustement: motifsAjustement,
};

export const getMotifLabel = ({
  motif,
  campagne = CURRENT_ANNEE_CAMPAGNE,
}: {
  motif: MotifLabel;
  campagne?: MotifCampagne;
}): string => {
  return MOTIFS_LABELS[campagne][motif];
};

export const getMotifs = () => motifs;
export const getMotifsCampagne = (campagne: MotifCampagne = CURRENT_ANNEE_CAMPAGNE): MotifLabel[] => {
  const motifsCampagne = MOTIFS_LABELS[campagne];
  return Object.keys(motifsCampagne) as MotifLabel[];
};
export const getMotifsTypeDemande = (typeDemande: TypeDemande): MotifLabel[] => getMotifs()[typeDemande];
export const getLabelsMotifsOuverture = () => motifsOuverture;
export const getLabelsMotifsFermeture = () => motifsFermeture;
export const getLabelsMotifsTransfert = () => motifsTransfert;
export const getLabelsMotifsColoration = () => motifsColoration;
export const getLabelsMotifsAjustement = () => motifsAjustement;
export const getMotifsTriggerAutre = () => motifsTriggerAutre;

export const hasMotifAutre = (values?: Array<string | undefined>) => {
  return values?.filter(
    (motif) =>
      MOTIFS_LABELS[2023][motif! as MotifLabel] !== undefined || MOTIFS_LABELS[2024][motif! as MotifLabel] !== undefined
  );
};
