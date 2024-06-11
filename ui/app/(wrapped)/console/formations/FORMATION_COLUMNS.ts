import { client } from "@/api.client";
import { ExportColumns } from "@/utils/downloadExport";

export const FORMATION_COLUMNS = {
  rentreeScolaire: "RS",
  libelleNiveauDiplome: "Diplôme",
  libelleFormation: "Formation",
  nbEtablissement: "Nb Etab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  libelleDispositif: "Dispositif",
  libelleFamille: "	Famille de métiers",
  cfd: "Code formation diplôme",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  cpcSousSecteur: "CPC Sous Secteur",
  libelleNsf: "Domaine de formation (NSF)",
  "continuum.libelleFormation": "Diplôme historique",
  "continuum.cfd": "Code diplôme historique",
  positionQuadrant: "Position dans le quadrant",
  codeDispositif: "Code dispositif",
  effectifEntree: "Effectif en entrée",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/formations"]["formations"][number]
>;
