import { themeDefinition } from "../../../../theme/theme";
import {
  FORMATION_ETABLISSEMENT_COLUMNS,
  FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT,
  FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL,
} from "./FORMATION_ETABLISSEMENT_COLUMNS";

export const GROUPED_FORMATION_ETABLISSEMENT_COLUMNS: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS>;
  }
> = {
  // rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.purpleGlycine[950],
    cellColor: "#FEF3FD",
    options: {
      libelleEtablissement: "Nom d'établissement",
      secteur: "Secteur",
      uai: "UAI",
      commune: "Commune",
      codeDepartement: "Code Département",
      libelleDepartement: "Département",
      codeAcademie: "Code Académie",
      libelleAcademie: "Académie",
      codeRegion: "Code Région",
      libelleRegion: "Région",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: themeDefinition.colors.bluefrance[975],
    options: {
      libelleFormation: "Formation",
      libelleNiveauDiplome: "Diplôme",
      libelleDispositif: "Dispositif",
      libelleFamille: "Famille de métiers",
      cfd: "Code formation diplôme",
      cpc: "CPC",
      cpcSecteur: "CPC Secteur",
      libelleNsf: "Domaine de formation (NSF)",
      "continuum.libelleFormation": "Diplôme historique",
      "continuum.cfd": "Code diplôme historique",
      codeDispositif: "Code dispositif",
    },
  },
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      effectif1: "Année 1",
      effectif2: "Année 2",
      effectif3: "Année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
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
      tauxPression: "Tx de pression",
      tauxRemplissage: "Tx de remplissage",
      valeurAjoutee: "Valeur ajoutée",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS>;
  }
>;

export const GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL: Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL>;
  }
> = {
  // rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.purpleGlycine[950],
    cellColor: "#FEF3FD",
    options: {
      libelleEtablissement: "Nom d'établissement",
      secteur: "Secteur",
      uai: "UAI",
      commune: "Commune",
      libelleDepartement: "Département",
      libelleAcademie: "Académie",
      libelleRegion: "Région",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: themeDefinition.colors.bluefrance[975],
    options: {
      libelleFormation: "Formation",
      libelleNiveauDiplome: "Diplôme",
      libelleDispositif: "Dispositif",
      libelleFamille: "Famille de métiers",
      cpc: "CPC",
      cpcSecteur: "CPC Secteur",
      libelleNsf: "Domaine de formation (NSF)",
      "continuum.libelleFormation": "Diplôme historique",
    },
  },
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      effectif1: "Année 1",
      effectif2: "Année 2",
      effectif3: "Année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
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
      tauxPression: "Tx de pression",
      tauxRemplissage: "Tx de remplissage",
      valeurAjoutee: "Valeur ajoutée",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL>;
  }
>;

export const GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT: Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT>;
  }
> = {
  // rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.purpleGlycine[950],
    cellColor: "#FEF3FD",
    options: {
      libelleEtablissement: "Nom d'établissement",
      secteur: "Secteur",
      uai: "UAI",
      commune: "Commune",
      libelleDepartement: "Département",
      libelleAcademie: "Académie",
      libelleRegion: "Région",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: themeDefinition.colors.bluefrance[975],
    options: {
      libelleFormation: "Formation",
      libelleNiveauDiplome: "Diplôme",
      libelleDispositif: "Dispositif",
      libelleFamille: "Famille de métiers",
      cpc: "CPC",
      cpcSecteur: "CPC Secteur",
      libelleNsf: "Domaine de formation (NSF)",
      "continuum.libelleFormation": "Diplôme historique",
    },
  },
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      effectif1: "Année 1",
      effectif2: "Année 2",
      effectif3: "Année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
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
      tauxPression: "Tx de pression",
      tauxRemplissage: "Tx de remplissage",
      valeurAjoutee: "Valeur ajoutée",
    },
  },
} as Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT>;
  }
>;
