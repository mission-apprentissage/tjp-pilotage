import { themeDefinition } from "../../../../theme/theme";
import {
  FORMATION_COLUMNS,
  FORMATION_COLUMNS_DEFAULT,
  FORMATION_COLUMNS_OPTIONAL,
} from "./FORMATION_COLUMNS";

export const GROUPED_FORMATION_COLUMNS: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_COLUMNS>;
  }
> = {
  // Rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "inherit",
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // Formation
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
  // Effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      nbEtablissement: "Nombre d'établissements",
      capacite: "Capacité",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
    },
  },
  // Indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
      positionQuadrant: "Position dans le quadrant",
      tauxInsertion: "Taux d'emploi 6 mois régional",
      tauxPoursuite: "Taux de poursuite d'études régional",
      tauxDevenirFavorable: "Taux de devenir favorable régional",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_COLUMNS>;
  }
>;

export const GROUPED_FORMATION_COLUMNS_OPTIONAL: Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_COLUMNS_OPTIONAL>;
  }
> = {
  // Rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "inherit",
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // Formation
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
    },
  },
  // Effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      nbEtablissement: "Nombre d'établissements",
      capacite: "Capacité",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
    },
  },
  // Indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
      positionQuadrant: "Position dans le quadrant",
      tauxInsertion: "Taux d'emploi 6 mois régional",
      tauxPoursuite: "Taux de poursuite d'études régional",
      tauxDevenirFavorable: "Taux de devenir favorable régional",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_COLUMNS_OPTIONAL>;
  }
>;

export const GROUPED_FORMATION_COLUMNS_DEFAULT: Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_COLUMNS_DEFAULT>;
  }
> = {
  // Rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "inherit",
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // Formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
      libelleDispositif: "Dispositif",
      libelleFormation: "Formation",
    },
  },
  // Effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      nbEtablissement: "Nombre d'établissements",
      capacite: "Capacité",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
    },
  },
  // Indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
      positionQuadrant: "Position dans le quadrant",
      tauxInsertion: "Taux d'emploi 6 mois régional",
      tauxPoursuite: "Taux de poursuite d'études régional",
      tauxDevenirFavorable: "Taux de devenir favorable régional",
    },
  },
} as Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_COLUMNS_DEFAULT>;
  }
>;
