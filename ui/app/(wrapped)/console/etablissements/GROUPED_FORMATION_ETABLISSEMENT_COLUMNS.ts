import { CURRENT_IJ_MILLESIME } from "shared";

import { themeDefinition } from "@/theme/theme";
import { formatMillesime } from "@/utils/formatLibelle";

import type {
  FORMATION_ETABLISSEMENT_COLUMNS,
  FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED,
  FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT,
  FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED,
  FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL,
  FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED,
} from "./FORMATION_ETABLISSEMENT_COLUMNS";

export const GROUPED_FORMATION_ETABLISSEMENT_COLUMNS: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS>;
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
  // Établissement
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
  // Formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
      libelleDispositif: "Dispositif",
      libelleFormation: "Formation",
      formationSpecifique: "Formation spécifique",
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
      evolutionEffectif: "Évolution des effectifs",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // Indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxPression: "Taux de pression",
      evolutionTauxPression: "Évolution du taux de pression",
      tauxDemande: "Taux de demande",
      evolutionTauxDemande: "Évolution du taux de demande",
      tauxRemplissage: "Taux de remplissage",
      evolutionTauxRemplissage: "Évolution du taux de remplissage",
      positionQuadrant: `Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionPositionQuadrant: `Évolution de la position dans le quadrant`,
      tauxDevenirFavorable: `Taux de devenir favorable régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxDevenirFavorable: `Évolution du taux de devenir favorable régional`,
      tauxInsertion: `Taux d'emploi 6 mois régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxInsertion: `Évolution du taux d'emploi à 6 mois régional`,
      tauxPoursuite: `Taux de poursuite d'études régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxPoursuite: `Évolution du taux de poursuite d'études régional`,
      tauxDevenirFavorableEtablissement: `Taux de devenir favorable de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxDevenirFavorableEtablissement: `Évolution du taux de devenir favorable de la formation dans l'établissement`,
      tauxInsertionEtablissement: `Taux d'emploi 6 mois de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxInsertionEtablissement: `Évolution du taux d'emploi à 6 mois de la formation dans l'établissement`,
      tauxPoursuiteEtablissement: `Taux de poursuite d'études de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxPoursuiteEtablissement: `Évolution du taux de poursuite d'études de la formation dans l'établissement`,
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
  // Rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "inherit",
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // Établissement
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
  // Formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
      libelleDispositif: "Dispositif",
      libelleFormation: "Formation",
      formationSpecifique: "Formation spécifique",
      libelleNiveauDiplome: "Diplôme",
      libelleFamille: "Famille de métiers",
      cpc: "CPC",
      cpcSecteur: "CPC Secteur",
      libelleNsf: "Domaine de formation (NSF)",
      "continuum.libelleFormation": "Diplôme historique",
    },
  },
  // Effectifs
  ["effectifs"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      evolutionEffectif: "Évolution des effectifs",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // Indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxPression: "Taux de pression",
      evolutionTauxPression: "Évolution du taux de pression",
      tauxDemande: "Taux de demande",
      evolutionTauxDemande: "Évolution du taux de demande",
      tauxRemplissage: "Taux de remplissage",
      evolutionTauxRemplissage: "Évolution du taux de remplissage",
      positionQuadrant: `Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionPositionQuadrant: `Évolution de la position dans le quadrant`,
      tauxDevenirFavorable: `Taux de devenir favorable régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxDevenirFavorable: `Évolution du taux de devenir favorable régional`,
      tauxInsertion: `Taux d'emploi 6 mois régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxInsertion: `Évolution du taux d'emploi à 6 mois régional`,
      tauxPoursuite: `Taux de poursuite d'études régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxPoursuite: `Évolution du taux de poursuite d'études régional`,
      tauxDevenirFavorableEtablissement: `Taux de devenir favorable de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxDevenirFavorableEtablissement: `Évolution du taux de devenir favorable de la formation dans l'établissement`,
      tauxInsertionEtablissement: `Taux d'emploi 6 mois de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxInsertionEtablissement: `Évolution du taux d'emploi à 6 mois de la formation dans l'établissement`,
      tauxPoursuiteEtablissement: `Taux de poursuite d'études de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxPoursuiteEtablissement: `Évolution du taux de poursuite d'études de la formation dans l'établissement`,
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
  // Rentrée scolaire
  ["rentrée scolaire"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "inherit",
    options: {
      rentreeScolaire: "Rentrée scolaire",
    },
  },
  // Établissement
  ["établissement"]: {
    color: themeDefinition.colors.purpleGlycine[950],
    cellColor: "#FEF3FD",
    options: {
      libelleEtablissement: "Nom d'établissement",
      commune: "Commune",
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
      evolutionEffectif: "Évolution des effectifs",
      effectif1: "Effectif en année 1",
      effectif2: "Effectif en année 2",
      effectif3: "Effectif en année 3",
      effectifEntree: "Effectif en entrée",
      capacite: "Capacité",
      premiersVoeux: "Nb de voeux",
    },
  },
  // Indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxPression: "Taux de pression",
      evolutionTauxPression: "Évolution du taux de pression",
      tauxDemande: "Taux de demande",
      evolutionTauxDemande: "Évolution du taux de demande",
      tauxRemplissage: "Taux de remplissage",
      evolutionTauxRemplissage: "Évolution du taux de remplissage",
      positionQuadrant: `Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionPositionQuadrant: `Évolution de la position dans le quadrant`,
      tauxDevenirFavorable: `Taux de devenir favorable régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxDevenirFavorable: `Évolution du taux de devenir favorable régional`,
      tauxInsertion: `Taux d'emploi 6 mois régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxInsertion: `Évolution du taux d'emploi à 6 mois régional`,
      tauxPoursuite: `Taux de poursuite d'études régional (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxPoursuite: `Évolution du taux de poursuite d'études régional`,
      tauxDevenirFavorableEtablissement: `Taux de devenir favorable de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxDevenirFavorableEtablissement: `Évolution du taux de devenir favorable de la formation dans l'établissement`,
      tauxInsertionEtablissement: `Taux d'emploi 6 mois de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxInsertionEtablissement: `Évolution du taux d'emploi à 6 mois de la formation dans l'établissement`,
      tauxPoursuiteEtablissement: `Taux de poursuite d'études de la formation dans l'établissement (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`,
      evolutionTauxPoursuiteEtablissement: `Évolution du taux de poursuite d'études de la formation dans l'établissement`,
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

export const GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED>;
  }
> = {
  ...GROUPED_FORMATION_ETABLISSEMENT_COLUMNS,
  // Caractéristiques de la transformation
  ["transformation"]: {
    color: themeDefinition.colors.greenArchipel[950],
    cellColor: "inherit",
    options: {
      numero: "Numéro de la demande",
      typeDemande: "Type de demande",
      dateEffetTransformation: "Date d'effet de la transformation",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED>;
  }
>;

export const GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED: Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED>;
  }
> = {
  ...GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL,
  // Caractéristiques de la transformation
  ["transformation"]: {
    color: themeDefinition.colors.greenArchipel[950],
    cellColor: "inherit",
    options: {

      numero: "Numéro de la demande",
      typeDemande: "Type de demande",
      dateEffetTransformation: "Date d'effet de la transformation",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED>;
  }
>;

export const GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED: Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED>;
  }
> = {
  ...GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT,
  // Caractéristiques de la transformation
  ["transformation"]: {
    color: themeDefinition.colors.greenArchipel[950],
    cellColor: "inherit",
    options: {
      numero: "Numéro de la demande",
      typeDemande: "Type de demande",
      dateEffetTransformation: "Date d'effet de la transformation",
    },
  },
} as Record<
  string,
  {
    color: string;
    options: Partial<typeof FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED>;
  }
>;
