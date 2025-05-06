import { themeDefinition } from "@/theme/theme";

import type {
  CORRECTIONS_COLUMNS,
  CORRECTIONS_COLUMNS_DEFAULT,
  CORRECTIONS_COLUMNS_OPTIONAL,
} from "./CORRECTIONS_COLUMN";

export const GROUPED_CORRECTIONS_COLUMNS: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof CORRECTIONS_COLUMNS>;
  }
> = {
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "white",
    options: {
      uai: "UAI",
      libelleEtablissement: "Établissement",
      commune: "Commune",
      codeRegion: "CodeRegion",
      libelleRegion: "Région",
      codeAcademie: "CodeAcadémie",
      libelleAcademie: "Académie",
      codeDepartement: "CodeDepartement",
      libelleDepartement: "Département",
      secteur: "Secteur",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: themeDefinition.colors.bluefrance[975],
    options: {
      cfd: "CFD",
      libelleNsf: "Domaine de formation (NSF)",
      libelleFormation: "Formation",
      formationSpecifique: "Formation spécifique",
      codeDispositif: "Code Dispositif",
      libelleDispositif: "Dispositif",
      niveauDiplome: "Diplôme",
    },
  },
  // demande
  ["demande"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
      libelleColoration: "Libellé coloration",
      commentaire: "Commentaire",
      demandeNumero: "N° demande",
      createdAt: "Date de création",
      updatedAt: "Date de dernière modification",
    },
  },
  // Correction
  ["correction"]: {
    color: themeDefinition.colors.yellowTournesol[950],
    cellColor: "#FEF6E3",
    options: {
      motifCorrection: "Motif(s) de la correction",
      autreMotifCorrection: "Autre motif de correction",
      raisonCorrection: "Type de modification",
      capaciteScolaireCorrigee: "Capacité scolaire corrigée",
      capaciteApprentissageCorrigee: "Capacité apprentissage corrigée",
      ecartScolaire: "Écart capacité scolaire",
      ecartApprentissage: "Écart capacité apprentissage",
    },
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      positionQuadrant: "Position dans le quadrant",
      tauxInsertionRegional: "Tx d'emploi à 6 mois régional",
      tauxPoursuiteRegional: "Tx de poursuite d'études régional",
      tauxDevenirFavorableRegional: "Tx de devenir favorable régional",
      tauxPressionRegional: "Tx de pression régional",
      nbEtablissement: "Nb établissement",
    },
  },
} satisfies Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof CORRECTIONS_COLUMNS>;
  }
>;

export const GROUPED_CORRECTIONS_COLUMNS_OPTIONAL: Record<
  string,
  { color: string; options: Partial<typeof CORRECTIONS_COLUMNS_OPTIONAL> }
> = {
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.grey[950],
    options: {
      libelleEtablissement: "Établissement",
      commune: "Commune",
      libelleRegion: "Région",
      libelleAcademie: "Académie",
      libelleDepartement: "Département",
      secteur: "Secteur Privé ou Public",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    options: {
      cfd: "CFD",
      libelleNsf: "Domaine de formation (NSF)",
      libelleFormation: "Formation",
      formationSpecifique: "Formation spécifique",
      codeDispositif: "Code Dispositif",
      libelleDispositif: "Dispositif",
      niveauDiplome: "Diplôme",
    },
  },
  // demande
  ["demande"]: {
    color: "#C3FAD5",
    options: {
      libelleColoration: "Libellé coloration",
      commentaire: "Commentaire",
      demandeNumero: "N° demande",
      createdAt: "Date de création",
      updatedAt: "Date de dernière modification",
    },
  },
  // Correction
  ["correction"]: {
    color: themeDefinition.colors.yellowTournesol[950],
    options: {
      motifCorrection: "Motif(s) de la correction",
      autreMotifCorrection: "Autre motif de correction",
      raisonCorrection: "Type de modification",
      capaciteScolaireCorrigee: "Capacité scolaire corrigée",
      capaciteApprentissageCorrigee: "Capacité apprentissage corrigée",
      ecartScolaire: "Écart capacité scolaire",
      ecartApprentissage: "Écart capacité apprentissage",
    },
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    color: "#FEE9E5",
    options: {
      positionQuadrant: "Position dans le quadrant",
      tauxInsertionRegional: "Tx d'emploi à 6 mois régional",
      tauxPoursuiteRegional: "Tx de poursuite d'études régional",
      tauxDevenirFavorableRegional: "Tx de devenir favorable régional",
      tauxPressionRegional: "Tx de pression régional",
      nbEtablissement: "Nb établissement",
    },
  },
} satisfies Record<string, { color: string; options: Partial<typeof CORRECTIONS_COLUMNS_OPTIONAL> }>;

export const GROUPED_CORRECTIONS_COLUMNS_DEFAULT: Record<
  string,
  { color: string; options: Partial<typeof CORRECTIONS_COLUMNS_DEFAULT> }
> = {
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.grey[950],
    options: {
      libelleEtablissement: "Établissement",
      commune: "Commune",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    options: {
      libelleNsf: "Domaine de formation (NSF)",
      libelleFormation: "Formation",
      niveauDiplome: "Diplôme",
    },
  },
  // Correction
  ["correction"]: {
    color: themeDefinition.colors.yellowTournesol[950],
    options: {
      motifCorrection: "Motif(s) de la correction",
      autreMotifCorrection: "Autre motif de correction",
      raisonCorrection: "Type de modification",
      capaciteScolaireCorrigee: "Capacité scolaire corrigée",
      capaciteApprentissageCorrigee: "Capacité apprentissage corrigée",
      ecartScolaire: "Écart capacité scolaire",
      ecartApprentissage: "Écart capacité apprentissage",
    },
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    color: "#FEE9E5",
    options: {
      positionQuadrant: "Position dans le quadrant",
    },
  },
} satisfies Record<string, { color: string; options: Partial<typeof CORRECTIONS_COLUMNS_DEFAULT> }>;
