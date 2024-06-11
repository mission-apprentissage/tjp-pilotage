import { client } from "@/api.client";
import { ExportColumns } from "@/utils/downloadExport";

export const FORMATION_ETABLISSEMENT_COLUMNS = {
  libelleEtablissement: "Nom d'établissement",
  rentreeScolaire: "RS",
  commune: "Commune",
  codeDepartement: "Code Département",
  libelleDepartement: "Département",
  codeAcademie: "Code Académie",
  libelleAcademie: "Académie",
  codeRegion: "Code Région",
  libelleRegion: "Région",
  libelleNiveauDiplome: "Diplome",
  libelleFormation: "Formation",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  capacite: "Capacité",
  premiersVoeux: "Nb de premiers voeux",
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  positionQuadrant: "Positionnement dans le quadrant",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  tauxInsertionEtablissement:
    "Tx d'emploi 6 mois de la formation dans l'établissement",
  tauxPoursuiteEtablissement:
    "Tx de poursuite d'études de la formation dans l'établissement",
  tauxDevenirFavorableEtablissement:
    "Tx de devenir favorable de la formation dans l'établissement",
  valeurAjoutee: "Valeur ajoutée",
  secteur: "Secteur",
  uai: "UAI",
  libelleDispositif: "Dispositif",
  libelleFamille: "Famille de métiers",
  cfd: "Code formation diplôme",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  cpcSousSecteur: "CPC Sous Secteur",
  libelleNsf: "Domaine de formation (NSF)",
  "continuum.libelleFormation": "Diplôme historique",
  "continuum.cfd": "Code diplôme historique",
  codeDispositif: "Code dispositif",
  effectifEntree: "Effectif en entrée",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/etablissements"]["etablissements"][number]
>;
