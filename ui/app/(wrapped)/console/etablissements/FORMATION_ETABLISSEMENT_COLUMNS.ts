import { client } from "@/api.client";
import { ExportColumns } from "@/utils/downloadExport";

export const FORMATION_ETABLISSEMENT_COLUMNS = {
  // rentrée scolaire
  rentreeScolaire: "RS",
  // établissement
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
  // formation
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
  // effectifs
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  capacite: "Capacité",
  premiersVoeux: "Nb de voeux",
  // indicateurs
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  positionQuadrant: "Position dans le quadrant",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  tauxInsertionEtablissement:
    "Tx d'emploi 6 mois de la formation dans l'établissement",
  tauxPoursuiteEtablissement:
    "Tx de poursuite d'études de la formation dans l'établissement",
  tauxDevenirFavorableEtablissement:
    "Tx de devenir favorable de la formation dans l'établissement",
  valeurAjoutee: "Valeur ajoutée",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/etablissements"]["etablissements"][number]
>;

export const FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL = {
  // établissement
  libelleEtablissement: "Nom d'établissement",
  commune: "Commune",
  libelleDepartement: "Département",
  libelleAcademie: "Académie",
  libelleRegion: "Région",
  secteur: "Secteur",
  uai: "UAI",
  // formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  libelleNiveauDiplome: "Diplôme",
  libelleFamille: "Famille de métiers",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  libelleNsf: "Domaine de formation (NSF)",
  "continuum.libelleFormation": "Diplôme historique",
  // effectifs
  rentreeScolaire: "RS",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  effectifEntree: "Effectif en entrée",
  capacite: "Capacité",
  premiersVoeux: "Nb de voeux",
  // indicateurs
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  positionQuadrant: "Position dans le quadrant",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  tauxInsertionEtablissement:
    "Tx d'emploi 6 mois de la formation dans l'établissement",
  tauxPoursuiteEtablissement:
    "Tx de poursuite d'études de la formation dans l'établissement",
  tauxDevenirFavorableEtablissement:
    "Tx de devenir favorable de la formation dans l'établissement",
  valeurAjoutee: "Valeur ajoutée",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/etablissements"]["etablissements"][number]
>;

export const FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT = {
  // établissement
  libelleEtablissement: "Nom d'établissement",
  commune: "Commune",
  // formation
  libelleDispositif: "Dispositif",
  libelleFormation: "Formation",
  // effectifs
  rentreeScolaire: "RS",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  capacite: "Capacité",
  premiersVoeux: "Nb de voeux",
  // indicateurs
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  positionQuadrant: "Position dans le quadrant",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  tauxInsertionEtablissement:
    "Tx d'emploi 6 mois de la formation dans l'établissement",
  tauxPoursuiteEtablissement:
    "Tx de poursuite d'études de la formation dans l'établissement",
  tauxDevenirFavorableEtablissement:
    "Tx de devenir favorable de la formation dans l'établissement",
  valeurAjoutee: "Valeur ajoutée",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/etablissements"]["etablissements"][number]
>;
