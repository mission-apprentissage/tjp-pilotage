import {CURRENT_IJ_MILLESIME} from 'shared';

import type { client } from "@/api.client";
import type { ExportColumns } from "@/utils/downloadExport";
import {formatMillesime} from '@/utils/formatLibelle';

export const FORMATION_COLUMNS = {
  // Rentrée scolaire
  rentreeScolaire: "RS",
  // Formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  libelleNiveauDiplome: "Diplôme",
  libelleFamille: "Famille de métiers",
  cfd: "Code formation diplôme",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  libelleNsf: "Domaine de formation (NSF)",
  "continuum.libelleFormation": "Diplôme historique",
  "continuum.cfd": "Code diplôme historique",
  codeDispositif: "Code dispositif",
  // Tags formation
  formationSpecifique: "Formation spécifique",
  actionPrioritaire: "Action prioritaire ?",
  typeFamille: "Type de famille de métiers",
  isFormationRenovee: "Formation rénovée ?",
  isHistorique: "Historique ?",
  isHistoriqueCoExistant: "Historique co-existant ?",
  // Effectifs
  nbEtablissement: "Nb Étab",
  evolutionEffectif: "Évolution des effectifs",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  // Indicateurs
  tauxPression: "Tx de pression",
  evolutionTauxPression: "Évolution du taux de pression",
  tauxRemplissage: "Tx de remplissage",
  evolutionTauxRemplissage: "Évolution du taux de remplissage",
  positionQuadrant: `Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  tauxInsertion: `Tx d'emploi 6 mois régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  evolutionTauxInsertion: "Évolution du taux d'emploi à 6 mois régional",
  tauxPoursuite: `Tx de poursuite d'études régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  evolutionTauxPoursuite: "Évolution du taux de poursuite d'études régional",
  tauxDevenirFavorable: `Tx de devenir favorable régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  evolutionTauxDevenirFavorable: "Évolution du taux de devenir favorable régional",
} satisfies ExportColumns<(typeof client.infer)["[GET]/formations"]["formations"][number]> & {
  formationSpecifique: string;
  actionPrioritaire: string;
  evolutionEffectif: string;
  evolutionTauxPression: string;
  evolutionTauxRemplissage: string;
  evolutionTauxInsertion: string;
  evolutionTauxPoursuite: string;
  evolutionTauxDevenirFavorable: string;
  isHistorique: string;
};

export const FORMATION_COLUMNS_OPTIONAL = {
  // Rentrée scolaire
  rentreeScolaire: "RS",
  // Formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  formationSpecifique: "Formation spécifique",
  libelleNiveauDiplome: "Diplôme",
  libelleFamille: "Famille de métiers",
  cfd: "Code formation diplôme",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  libelleNsf: "Domaine de formation (NSF)",
  // Effectifs
  nbEtablissement: "Nb Étab",
  evolutionEffectif: "Évolution des effectifs",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  // Indicateurs
  tauxPression: "Tx de pression",
  evolutionTauxPression: "Évolution du taux de pression",
  tauxRemplissage: "Tx de remplissage",
  evolutionTauxRemplissage: "Évolution du taux de remplissage",
  positionQuadrant: "Position dans le quadrant",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  evolutionTauxInsertion: "Évolution du taux d'emploi à 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  evolutionTauxPoursuite: "Évolution du taux de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  evolutionTauxDevenirFavorable: "Évolution du taux de devenir favorable régional",
} satisfies Partial<typeof FORMATION_COLUMNS>;

export const FORMATION_COLUMNS_DEFAULT = {
  // Rentrée scolaire
  rentreeScolaire: "RS",
  // Formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  // Effectifs
  nbEtablissement: "Nb Étab",
  evolutionEffectif: "Évolution des effectifs",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  // Indicateurs
  tauxPression: "Tx de pression",
  evolutionTauxPression: "Évolution du taux de pression",
  tauxRemplissage: "Tx de remplissage",
  evolutionTauxRemplissage: "Évolution du taux de remplissage",
  positionQuadrant: "Position dans le quadrant",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  evolutionTauxInsertion: "Évolution du taux d'emploi à 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  evolutionTauxPoursuite: "Évolution du taux de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  evolutionTauxDevenirFavorable: "Évolution du taux de devenir favorable régional",
} satisfies Partial<typeof FORMATION_COLUMNS_OPTIONAL>;
