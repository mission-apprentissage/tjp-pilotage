import type { client } from "@/api.client";
import type { ExportColumns } from "@/utils/downloadExport";

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
  // Effectifs
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  // Indicateurs
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  positionQuadrant: "Position dans le quadrant",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
} satisfies ExportColumns<(typeof client.infer)["[GET]/formations"]["formations"][number]>;

export const FORMATION_COLUMNS_OPTIONAL = {
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
  // Effectifs
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  // Indicateurs
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  positionQuadrant: "Position dans le quadrant",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
} satisfies ExportColumns<(typeof client.infer)["[GET]/formations"]["formations"][number]>;

export const FORMATION_COLUMNS_DEFAULT = {
  // Rentrée scolaire
  rentreeScolaire: "RS",
  // Formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  // Effectifs
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  // Indicateurs
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  positionQuadrant: "Position dans le quadrant",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
} satisfies ExportColumns<(typeof client.infer)["[GET]/formations"]["formations"][number]>;
