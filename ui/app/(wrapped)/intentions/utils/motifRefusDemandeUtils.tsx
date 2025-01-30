import type { DemandeTypeType } from "shared/enum/demandeTypeEnum";

export type MotifRefusLabel = keyof typeof MOTIFS_REFUS_LABELS;

export const getMotifRefusLabel = (motif: MotifRefusLabel): string => MOTIFS_REFUS_LABELS[motif];

export const getMotifsRefus = () => motifs;
export const getMotifsRefusTypeDemande = (typeDemande: DemandeTypeType): MotifRefusLabel[] =>
  getMotifsRefus()[typeDemande] ?? [];
export const getLabelsMotifsRefusOuverture = () => motifsRefusOuverture;
export const getLabelsMotifsRefusFermeture = () => motifsRefusFermeture;

export const MOTIFS_REFUS_LABELS = {
  probleme_financement: "Problème de financement",
  probleme_bati: "Problème de bâti",
  probleme_transport_hebergement_eleves: "Problème de transport ou d'hébergement des élèves",
  probleme_calendrier: "Problème de calendrier - hors délai",
  correpond_pas_axes_prioritaires: "Ne correspond pas aux axes prioritaires fixés",
  prevision_effectif_faible: "Prévision d'effectif trop faible",
  concurrence_organisme_formation: "Mise en concurrence entre organismes de formation",
  concurrence_voie_formation: "Mise en concurrence entre différentes voies de formation",
  probleme_rh: "Problème RH",
  sauvegarde_metier_rare: "Sauvegarde d'un métier rare / ancré localement",
  correspond_axes_prioritaires: "Correspond aux axes prioritaires fixés",
  formation_demandee_eleves: "Formation très demandée par les élèves",
  trop_peu_lieux_formation_localement: "Trop peu de lieux de formation localement",
  autre: "Autre motif (veuillez préciser)",
};

const motifsRefusOuverture: MotifRefusLabel[] = [
  "probleme_financement",
  "probleme_bati",
  "probleme_rh",
  "probleme_transport_hebergement_eleves",
  "probleme_calendrier",
  "correpond_pas_axes_prioritaires",
  "prevision_effectif_faible",
  "concurrence_organisme_formation",
  "concurrence_voie_formation",
  "autre",
];

const motifsRefusFermeture: MotifRefusLabel[] = [
  "sauvegarde_metier_rare",
  "correspond_axes_prioritaires",
  "formation_demandee_eleves",
  "trop_peu_lieux_formation_localement",
  "probleme_rh",
  "autre",
];

const motifs: Partial<Record<DemandeTypeType, MotifRefusLabel[]>> = {
  ouverture_nette: motifsRefusOuverture,
  ouverture_compensation: motifsRefusOuverture,
  augmentation_nette: motifsRefusOuverture,
  augmentation_compensation: motifsRefusOuverture,
  fermeture: motifsRefusFermeture,
  diminution: motifsRefusFermeture,
  transfert: motifsRefusOuverture,
  coloration: motifsRefusOuverture,
};
