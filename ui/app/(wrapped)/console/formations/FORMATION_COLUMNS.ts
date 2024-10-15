import { client } from "@/api.client";
import { ExportColumns } from "@/utils/downloadExport";

export const FORMATION_COLUMNS = {
  // Effectifs
  rentreeScolaire: "RS",
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
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
  // Indicateurs
  positionQuadrant: "Position dans le quadrant",
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/formations"]["formations"][number]
>;

export const FORMATION_COLUMNS_OPTIONAL = {
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
  rentreeScolaire: "RS",
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  // Indicateurs
  positionQuadrant: "Position dans le quadrant",
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/formations"]["formations"][number]
>;

export const FORMATION_COLUMNS_DEFAULT = {
  // Formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  // Effectifs
  rentreeScolaire: "RS",
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  // Indicateurs
  positionQuadrant: "Position dans le quadrant",
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/formations"]["formations"][number]
>;
