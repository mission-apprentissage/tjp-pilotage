import { themeDefinition } from "@/theme/theme";

import type { DEMANDES_COLUMNS, DEMANDES_COLUMNS_OPTIONAL } from "./DEMANDES_COLUMNS";

export const GROUPED_DEMANDES_COLUMNS: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof DEMANDES_COLUMNS>;
  }
> = {
  // Rentrée scolaire
  ["demande"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "inherit",
    options: {
      rapprochement: "Rapprochement",
      numero: "N°Demande",
      statut: "Statut",
      typeDemande: "Type",
      createdAt: "Créé le",
      updatedAt: "Der. modif.",
      rentreeScolaire: "RS",
      motif: "Motif",
      autreMotif: "Autre motif",
      coloration: "Coloration",
      libelleColoration: "Libellé(s) coloration(s)",
      amiCma: "AMI/CMA ?",
      commentaire: "Commentaire",
      userName: "Auteur",
      formationRH: "Formation(s) ?",
      nbFormationRH: "Nombre de formations",
      discipline1FormationRH: "Discipline 1 formation",
      discipline2FormationRH: "Discipline 2 formation",
      professeurAssocieRH: "Professeur(s) associé(s) ?",
      nbProfesseurAssocieRH: "Nombre de professeurs associés",
      discipline1ProfesseurAssocieRH: "Discipline 1 professeur associé",
      discipline2ProfesseurAssocieRH: "Discipline 2 professeur associé",
      reconversionRH: "Reconversion(s) ?",
      nbReconversionRH: "Nombre de reconversions",
      discipline1ReconversionRH: "Discipline 1 reconversion",
      discipline2ReconversionRH: "Discipline 2 reconversion",
      recrutementRH: "Recrutement(s) ?",
      nbRecrutementRH: "Nombre de recrutements",
      discipline1RecrutementRH: "Discipline 1 recrutement",
      discipline2RecrutementRH: "Discipline 2 recrutement",
      inspecteurReferent: "Inspecteur",
    },
  },
  // Actions
  ["actions"]: {
    color: themeDefinition.colors.bluefrance[625],
    cellColor: "inherit",
    options: {
      actions: "Actions",
    },
  },
  // Formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
      cfd: "CFD",
      libelleFormation: "Diplôme",
      codeDispositif: "Code dispositif",
      libelleDispositif: "Dispositif",
      libelleFCIL: "Libellé de la FCIL",
    },
  },
  // Établissement
  ["établissement"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      uai: "UAI",
      libelleEtablissement: "Établissement",
      codeRegion: "Code Region",
      libelleRegion: "Région",
      codeAcademie: "Code Académie",
      libelleAcademie: "Académie",
      codeDepartement: "Code Département",
      libelleDepartement: "Dpt.",
    },
  },
  // Capacités
  ["capacités"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      capaciteScolaireActuelle: "Capacité actuelle en voie scolaire",
      capaciteScolaire: "Future capacité en voie scolaire",
      capaciteScolaireColoreeActuelle: "Capacité colorée actuelle en voie scolaire",
      capaciteScolaireColoree: "Future capacité colorée en voie scolaire",
      capaciteApprentissageActuelle: "Capacité actuelle en apprentissage",
      capaciteApprentissage: "Future capacité en apprentissage",
      capaciteApprentissageColoreeActuelle: "Capacité colorée actuelle en apprentissage",
      capaciteApprentissageColoree: "Future capacité colorée en apprentissage",
    },
  },
  // Indicateurs
  ["indicateurs"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      tauxPression: "Taux de pression",
      tauxDemande: "Taux de demande",
      tauxRemplissage: "Taux de remplissage",
      positionQuadrant: "Position dans le quadrant",
      tauxInsertion: "Taux d'emploi 6 mois régional",
      tauxPoursuite: "Taux de poursuite d'études régional",
      tauxDevenirFavorable: "Taux de devenir favorable régional",
    },
  },
  // Avis
  ["avis et commentaires"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      avis0: "Avis 1",
      avis1: "Avis 2",
      avis2: "Avis 3",
      avis3: "Avis 4",
      avis4: "Avis 5",
      avis5: "Avis 6",
      avis6: "Avis 7",
      avis7: "Avis 8",
      avis8: "Avis 9",
      avis9: "Avis 10",
      lastChangementStatutCommentaire: "Commentaire du dernier changement de statut",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof DEMANDES_COLUMNS>;
  }
>;

export const GROUPED_DEMANDES_COLUMNS_OPTIONAL: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof DEMANDES_COLUMNS_OPTIONAL>;
  }
> = {
  // Rentrée scolaire
  ["demande"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: "inherit",
    options: {
      rapprochement: "Rapprochement",
      numero: "N°Demande",
      statut: "Statut",
      typeDemande: "Type",
      createdAt: "Créé le",
      updatedAt: "Der. modif.",
      rentreeScolaire: "RS",
      motif: "Motif",
      autreMotif: "Autre motif",
      coloration: "Coloration",
      libelleColoration: "Libellé(s) coloration(s)",
      amiCma: "AMI/CMA ?",
      commentaire: "Commentaire",
      userName: "Auteur",
      inspecteurReferent: "Inspecteur",
    },
  },
  // Actions
  ["actions"]: {
    color: themeDefinition.colors.bluefrance[625],
    cellColor: "inherit",
    options: {
      actions: "Actions",
    },
  },
  // Formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    cellColor: "inherit",
    options: {
      cfd: "CFD",
      libelleFormation: "Diplôme",
      codeDispositif: "Code dispositif",
      libelleDispositif: "Dispositif",
      libelleFCIL: "Libellé de la FCIL",
    },
  },
  // Établissement
  ["établissement"]: {
    color: "#C3FAD5",
    cellColor: "inherit",
    options: {
      uai: "UAI",
      libelleEtablissement: "Établissement",
      codeRegion: "Code Region",
      libelleRegion: "Région",
      codeAcademie: "Code Académie",
      libelleAcademie: "Académie",
      codeDepartement: "Code Département",
      libelleDepartement: "Dpt.",
    },
  },
  // Capacités
  ["capacités"]: {
    color: "#FEE9E5",
    cellColor: "inherit",
    options: {
      capaciteScolaireActuelle: "Capacité actuelle en voie scolaire",
      capaciteScolaire: "Future capacité en voie scolaire",
      capaciteScolaireColoreeActuelle: "Capacité colorée actuelle en voie scolaire",
      capaciteScolaireColoree: "Future capacité colorée en voie scolaire",
      capaciteApprentissageActuelle: "Capacité actuelle en apprentissage",
      capaciteApprentissage: "Future capacité en apprentissage",
      capaciteApprentissageColoreeActuelle: "Capacité colorée actuelle en apprentissage",
      capaciteApprentissageColoree: "Future capacité colorée en apprentissage",
    },
  },
  // Avis
  ["avis et commentaires"]: {
    color: themeDefinition.colors.greenArchipel[557],
    cellColor: "inherit",
    options: {
      progression: "Progression",
      avisPhaseEnCours: "Avis - phase en cours",
      derniersAvisPhaseEnCours: "Derniers avis - phase en cours",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof DEMANDES_COLUMNS_OPTIONAL>;
  }
>;
