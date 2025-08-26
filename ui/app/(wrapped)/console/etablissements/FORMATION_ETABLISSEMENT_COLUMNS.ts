import { CURRENT_IJ_MILLESIME } from "shared";

import type { client } from "@/api.client";
import type { ExportColumns } from "@/utils/downloadExport";
import { formatMillesime } from "@/utils/formatLibelle";

export const FORMATION_ETABLISSEMENT_COLUMNS = {
  // Rentrée scolaire
  rentreeScolaire: "RS",
  // Établissement
  libelleEtablissement: "Nom d'établissement",
  commune: "Commune",
  codeDepartement: "Code Département",
  libelleDepartement: "Département",
  codeAcademie: "Code Académie",
  libelleAcademie: "Académie",
  codeRegion: "Code Région",
  libelleRegion: "Région",
  secteur: "Secteur",
  uai: "UAI",
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
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  capacite: "Capacité",
  premiersVoeux: "Nb de voeux",
  // Indicateurs
  tauxPression: "Tx de pression",
  tauxDemande: "Tx de demande",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: `Tx d'emploi 6 mois régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  tauxPoursuite: `Tx de poursuite d'études régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  positionQuadrant: `Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  tauxDevenirFavorable: `Tx de devenir favorable régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  tauxInsertionEtablissement: `Tx d'emploi 6 mois de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  tauxPoursuiteEtablissement: `Tx de poursuite d'études de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  tauxDevenirFavorableEtablissement: `Tx de devenir favorable de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
  valeurAjoutee: "Valeur ajoutée",
} satisfies ExportColumns<(typeof client.infer)["[GET]/etablissements"]["etablissements"][number]> & {
  formationSpecifique: string;
  actionPrioritaire: string;
  isHistorique: string;
};

export const FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL = {
  // Rentrée scolaire
  rentreeScolaire: "RS",
  // Établissement
  libelleEtablissement: "Nom d'établissement",
  commune: "Commune",
  libelleDepartement: "Département",
  libelleAcademie: "Académie",
  libelleRegion: "Région",
  secteur: "Secteur",
  uai: "UAI",
  // Formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  formationSpecifique: "Formation spécifique",
  libelleNiveauDiplome: "Diplôme",
  libelleFamille: "Famille de métiers",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  libelleNsf: "Domaine de formation (NSF)",
  "continuum.libelleFormation": "Diplôme historique",
  // Effectifs
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  capacite: "Capacité",
  premiersVoeux: "Nb de voeux",
  // Indicateurs
  tauxPression: "Tx de pression",
  tauxDemande: "Tx de demande",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  positionQuadrant: "Position dans le quadrant",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  tauxInsertionEtablissement: "Tx d'emploi 6 mois de la formation dans l'établissement",
  tauxPoursuiteEtablissement: "Tx de poursuite d'études de la formation dans l'établissement",
  tauxDevenirFavorableEtablissement: "Tx de devenir favorable de la formation dans l'établissement",
  valeurAjoutee: "Valeur ajoutée",
} satisfies Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS>;

export const FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT = {
  // Rentrée scolaire
  rentreeScolaire: "RS",
  // Établissement
  commune: "Commune",
  libelleEtablissement: "Nom d'établissement",
  // Formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  // Effectifs
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  capacite: "Capacité",
  premiersVoeux: "Nb de voeux",
  // Indicateurs
  tauxPression: "Tx de pression",
  tauxDemande: "Tx de demande",
  tauxRemplissage: "Tx de remplissage",
  positionQuadrant: "Position dans le quadrant",
  tauxInsertionEtablissement: "Tx d'emploi 6 mois de la formation dans l'établissement",
  tauxPoursuiteEtablissement: "Tx de poursuite d'études de la formation dans l'établissement",
  tauxDevenirFavorableEtablissement: "Tx de devenir favorable de la formation dans l'établissement",
} satisfies Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL>;

export const FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED = {
  ...FORMATION_ETABLISSEMENT_COLUMNS,
  // Caractéristiques de la transformation
  numero: "Numéro de la demande",
  dateEffetTransformation: "Date d'effet de la transformation",
  previsionnel: "Prévisionnel",
  typeDemande: "Type de demande",
} satisfies ExportColumns<(typeof client.infer)["[GET]/etablissements"]["etablissements"][number]>;

export const FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED = {
  ...FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL,
  // Caractéristiques de la transformation
  numero: "Numéro de la demande",
  dateEffetTransformation: "Date d'effet de la transformation",
  previsionnel: "Prévisionnel",
  typeDemande: "Type de demande",
} satisfies Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED>;

export const FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED = {
  ...FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT,
  // Caractéristiques de la transformation
  dateEffetTransformation: "Date d'effet de la transformation",
  typeDemande: "Type de demande",
} satisfies Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED>;
