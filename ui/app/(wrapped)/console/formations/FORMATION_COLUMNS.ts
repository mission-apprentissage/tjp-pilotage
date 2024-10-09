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
  libelleNiveauDiplome: "Diplôme",
  libelleFormation: "Formation",
  libelleDispositif: "Dispositif",
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
  // Effectifs
  rentreeScolaire: "RS",
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  // Formation
  libelleNiveauDiplome: "Diplôme",
  libelleFormation: "Formation",
  libelleDispositif: "Dispositif",
  libelleFamille: "Famille de métiers",
  cfd: "Code formation diplôme",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  libelleNsf: "Domaine de formation (NSF)",
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
  // Effectifs
  rentreeScolaire: "RS",
  nbEtablissement: "Nb Étab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  // Formation
  libelleNiveauDiplome: "Diplôme",
  libelleFormation: "Formation",
  libelleDispositif: "Dispositif",
  libelleFamille: "Famille de métiers",
  libelleNsf: "Domaine de formation (NSF)",
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
