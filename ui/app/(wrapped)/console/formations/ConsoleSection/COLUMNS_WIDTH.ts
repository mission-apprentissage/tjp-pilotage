
import type { FORMATION_COLUMNS_OPTIONAL } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";

export const CHEVRON_COLUMN_WIDTH = 50;

export const COLUMNS_WIDTH: Record<keyof typeof FORMATION_COLUMNS_OPTIONAL, number> = {
  // Rentrée scolaire
  rentreeScolaire: 100,
  // Formation
  libelleDispositif: 150,
  libelleFormation: 300,
  formationSpecifique: 150,
  libelleNiveauDiplome: 150,
  libelleFamille: 150,
  cfd: 100,
  cpc: 100,
  cpcSecteur: 100,
  libelleNsf: 100,
  // Effectifs
  nbEtablissement: 100,
  evolutionEffectif: 250,
  effectif1: 150,
  effectif2: 150,
  effectif3: 150,
  effectifEntree: 150,
  // Indicateurs
  tauxPression: 200,
  evolutionTauxPression: 250,
  tauxDemande: 200,
  evolutionTauxDemande: 280,
  tauxRemplissage: 200,
  evolutionTauxRemplissage: 280,
  tauxInsertion: 200,
  evolutionTauxInsertion: 280,
  tauxPoursuite: 200,
  evolutionTauxPoursuite: 280,
  positionQuadrant: 150,
  tauxDevenirFavorable: 200,
  evolutionTauxDevenirFavorable: 280,
};
