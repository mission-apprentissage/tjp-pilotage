
import type { FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";

export const CHEVRON_COLUMN_WIDTH = 50;

export const COLUMNS_WIDTH: Record<keyof typeof FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED, number> = {
  // Rentrée scolaire
  rentreeScolaire: 100,
  // Établissement
  libelleEtablissement: 300,
  commune: 150,
  libelleDepartement: 150,
  libelleAcademie: 150,
  libelleRegion: 150,
  secteur: 120,
  uai: 120,
  // Formation
  libelleDispositif: 150,
  libelleFormation: 300,
  libelleNiveauDiplome: 150,
  libelleFamille: 150,
  cpc: 100,
  cpcSecteur: 100,
  libelleNsf: 100,
  "continuum.libelleFormation": 100,
  // Transformation
  numero: 100,
  dateEffetTransformation: 200,
  typeDemande: 250,
  // Tags formation
  formationSpecifique: 150,
  // Effectifs
  evolutionEffectif: 250,
  effectif1: 150,
  effectif2: 150,
  effectif3: 150,
  effectifEntree: 150,
  capacite: 150,
  premiersVoeux: 150,
  // Indicateurs
  tauxPression: 200,
  evolutionTauxPression: 250,
  tauxDemande: 200,
  evolutionTauxDemande: 250,
  tauxRemplissage: 200,
  evolutionTauxRemplissage: 320,
  tauxInsertion: 200,
  evolutionTauxInsertion: 320,
  tauxPoursuite: 200,
  evolutionTauxPoursuite: 320,
  positionQuadrant: 150,
  tauxDevenirFavorable: 200,
  evolutionTauxDevenirFavorable: 320,
  tauxInsertionEtablissement: 200,
  evolutionTauxInsertionEtablissement: 320,
  tauxPoursuiteEtablissement: 200,
  evolutionTauxPoursuiteEtablissement: 320,
  tauxDevenirFavorableEtablissement: 200,
  evolutionTauxDevenirFavorableEtablissement: 320,
  valeurAjoutee: 150,
};
