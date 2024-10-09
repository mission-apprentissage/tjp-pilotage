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
  // rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: themeDefinition.colors.bluefrance[975],
    options: {
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
    },
  },
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      nbEtablissement: "Nb Étab",
      capacite: "Capacité",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
      positionQuadrant: "Position dans le quadrant",
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
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
  // rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      nbEtablissement: "Nb Étab",
      capacite: "Capacité",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: themeDefinition.colors.bluefrance[975],
    options: {
      libelleNiveauDiplome: "Diplôme",
      libelleFormation: "Formation",
      libelleDispositif: "Dispositif",
      libelleFamille: "Famille de métiers",
      cfd: "Code formation diplôme",
      cpc: "CPC",
      cpcSecteur: "CPC Secteur",
      libelleNsf: "Domaine de formation (NSF)",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
      positionQuadrant: "Position dans le quadrant",
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
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
  // effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      nbEtablissement: "Nb Étab",
      capacite: "Capacité",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: themeDefinition.colors.bluefrance[975],
    options: {
      libelleNiveauDiplome: "Diplôme",
      libelleFormation: "Formation",
      libelleDispositif: "Dispositif",
      libelleFamille: "Famille de métiers",
      libelleNsf: "Domaine de formation (NSF)",
    },
  },
  // indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
      positionQuadrant: "Position dans le quadrant",
      tauxPression: "Taux de pression",
      tauxRemplissage: "Taux de remplissage",
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
