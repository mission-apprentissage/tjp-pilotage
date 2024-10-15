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
    cellColor: "inherit",
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.purpleGlycine[950],
    cellColor: "inherit",
    options: {
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
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
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
    },
  },
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxInsertion: "Taux d'emploi 6 mois régional",
      tauxPoursuite: "Taux de poursuite d'études régional",
      positionQuadrant: "Position dans le quadrant",
      tauxDevenirFavorable: "Taux de devenir favorable régional",
      tauxInsertionEtablissement:
        "Taux d'emploi 6 mois de la formation dans l'établissement",
      tauxPoursuiteEtablissement:
        "Taux de poursuite d'études de la formation dans l'établissement",
      tauxDevenirFavorableEtablissement:
        "Taux de devenir favorable de la formation dans l'établissement",
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
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
    cellColor: "inherit",
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.purpleGlycine[950],
    cellColor: "inherit",
    options: {
      libelleEtablissement: "Nom d'établissement",
      commune: "Commune",
      libelleDepartement: "Département",
      libelleAcademie: "Académie",
      libelleRegion: "Région",
      secteur: "Secteur",
      uai: "UAI",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
      libelleDispositif: "Dispositif",
      libelleFormation: "Formation",
      libelleNiveauDiplome: "Diplôme",
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
    cellColor: "inherit",
    options: {
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxInsertion: "Taux d'emploi 6 mois régional",
      tauxPoursuite: "Taux de poursuite d'études régional",
      positionQuadrant: "Position dans le quadrant",
      tauxDevenirFavorable: "Taux de devenir favorable régional",
      tauxInsertionEtablissement:
        "Taux d'emploi 6 mois de la formation dans l'établissement",
      tauxPoursuiteEtablissement:
        "Taux de poursuite d'études de la formation dans l'établissement",
      tauxDevenirFavorableEtablissement:
        "Taux de devenir favorable de la formation dans l'établissement",
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
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
    cellColor: "inherit",
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
      commune: "Commune",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
      libelleDispositif: "Dispositif",
      libelleFormation: "Formation",
    },
  },
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxInsertion: "Taux d'emploi 6 mois régional",
      tauxPoursuite: "Taux de poursuite d'études régional",
      positionQuadrant: "Position dans le quadrant",
      tauxDevenirFavorable: "Taux de devenir favorable régional",
      tauxInsertionEtablissement:
        "Taux d'emploi 6 mois de la formation dans l'établissement",
      tauxPoursuiteEtablissement:
        "Taux de poursuite d'études de la formation dans l'établissement",
      tauxDevenirFavorableEtablissement:
        "Taux de devenir favorable de la formation dans l'établissement",
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
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
