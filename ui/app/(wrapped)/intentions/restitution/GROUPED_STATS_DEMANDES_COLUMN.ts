import { themeDefinition } from "@/theme/theme";

import type {
  STATS_DEMANDES_COLUMNS,
  STATS_DEMANDES_COLUMNS_DEFAULT,
  STATS_DEMANDES_COLUMNS_OPTIONAL,
} from "./STATS_DEMANDES_COLUMN";

export const GROUPED_STATS_DEMANDES_COLUMNS: Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof STATS_DEMANDES_COLUMNS>;
  }
> = {
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
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
      libelleNiveauDiplome: "Diplôme",
    },
  },
  // demande
  ["demande"]: {
    color: "#FEE9E5",
    cellColor: "#FEF4F2",
    options: {
      typeDemande: "Type de demande",
      motif: "Motif(s) de la demande",
      rentreeScolaire: "RS",
      differenceCapaciteScolaire: "Nombre de places en voie scolaire",
      differenceCapaciteApprentissage: "Nombre de places en apprentissage",
      differenceCapaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
      differenceCapaciteApprentissageColoree: "Nombre de places colorées en apprentissage",
      capaciteScolaireActuelle: "Capacité en voie scolaire actuelle",
      capaciteScolaire: "Future capacité en voie scolaire",
      capaciteScolaireColoreeActuelle: "Capacité colorée actuelle en voie scolaire",
      capaciteScolaireColoree: "Future capacité colorée en voie scolaire",
      capaciteApprentissageActuelle: "Capacité en apprentissage actuelle",
      capaciteApprentissage: "Future capacité en apprentissage",
      capaciteApprentissageColoreeActuelle: "Capacité colorée actuelle en apprentissage",
      capaciteApprentissageColoree: "Future capacité colorée en apprentissage",
      libelleColoration: "Libellé coloration",
      libelleFCIL: "Libellé FCIL",
      amiCma: "AMI/CMA ?",
      amiCmaValide: "Financement AMI/CMA validé ?",
      amiCmaEnCoursValidation: "Demande de financement AMI/CMA en cours ?",
      amiCmaValideAnnee: "Année de validation de l'AMI/CMA",
      filiereCmq: "Filière CMQ",
      nomCmq: "Nom CMQ",
      inspecteurReferent: "Inspecteur référent",
      commentaire: "Commentaire",
      numero: "N° demande",
      partenaireEconomique1: "Partenaire économique 1",
      partenaireEconomique2: "Partenaire économique 2",
      createdAt: "Date de création",
      updatedAt: "Date de dernière modification",
    },
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    color: "#C3FAD5",
    cellColor: "#E3FDEB",
    options: {
      positionQuadrant: "Position dans le quadrant",
      tauxInsertionRegional: "Tx d'emploi à 6 mois régional",
      tauxPoursuiteRegional: "Tx de poursuite d'études régional",
      tauxDevenirFavorableRegional: "Tx de devenir favorable régional",
      tauxPressionRegional: "Tx de pression régional",
      nbEtablissement: "Nb établissement",
    },
  },
  // RH
  ["implications RH"]: {
    color: themeDefinition.colors.yellowTournesol[950],
    cellColor: "#FEF6E3",
    options: {
      nbRecrutementRH: "Nombre de recrutements",
      disciplinesRecrutementRH: "Disciplines des recrutements",
      nbReconversionRH: "Nombre de reconversions",
      disciplinesReconversionRH: "Disciplines des reconversions",
      nbProfesseurAssocieRH: "Nombre de professeurs associés",
      disciplinesProfesseurAssocieRH: "Disciplines des professeurs associés",
      nbFormationRH: "Nombre de formations",
      disciplinesFormationRH: "Disciplines des formations",
    },
  },
  // Travaux et achats
  ["travaux et achats"]: {
    color: themeDefinition.colors.greenArchipel[950],
    cellColor: "#E5FBFD",
    options: {
      travauxAmenagement: "Travaux ou aménagement ?",
      travauxAmenagementCout: "Coût des travaux et aménagement",
      travauxAmenagementDescription: "Description des travaux et aménagement",
      achatEquipement: "Achat d'équipement ?",
      achatEquipementCout: "Coût des achats d'équipement",
      achatEquipementDescription: "Description des achats d'équipement",
    },
  },
  // Hébergement
  ["hébergement et restauration"]: {
    color: themeDefinition.colors.purpleGlycine[950],
    cellColor: "#FEF3FD",
    options: {
      augmentationCapaciteAccueilHebergement: "Besoin d'augmentation de la capacité d'hébergement ?",
      augmentationCapaciteAccueilHebergementPlaces: "Nombre de places d'hébergement supplémentaires",
      augmentationCapaciteAccueilHebergementPrecisions: "Précisions sur l'augmentation de la capacité d'hébergement",
      augmentationCapaciteAccueilRestauration: "Besoin d'augmentation de la capacité de restauration ?",
      augmentationCapaciteAccueilRestaurationPlaces: "Nombre de places de restauration supplémentaires",
      augmentationCapaciteAccueilRestaurationPrecisions: "Précisions sur l'augmentation de la capacité de restauration",
    },
  },
  // Statut
  ["statut"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
    options: {
      statut: "Statut",
      motifRefus: "Motif(s) de refus",
    },
  },
  // Pilotage
  ["pilotage"]: {
    color: themeDefinition.colors.grey[950],
    cellColor: themeDefinition.colors.grey[1000],
    options: {
      pilotageCapacite: "Capacité RS 2024",
      pilotageEffectif: "Effectif RS 2024",
      pilotageTauxRemplissage: "Remplissage RS 2024",
      pilotageTauxPression: "Tx Pression RS 2024",
      pilotageTauxDemande: "Tx Demande RS 2024",
    },
  },
} as Record<
  string,
  {
    color: string;
    cellColor: string;
    options: Partial<typeof STATS_DEMANDES_COLUMNS>;
  }
>;

export const GROUPED_STATS_DEMANDES_COLUMNS_OPTIONAL: Record<
  string,
  { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL>}
> = {
  // établissement
  ["établissement"]: {
    color: themeDefinition.colors.grey[950],
    options: {
      libelleEtablissement: "Établissement",
      commune: "Commune",
      libelleRegion: "Région",
      libelleAcademie: "Académie",
      secteur: "Secteur Privé ou Public",
    },
  },
  // formation
  ["formation"]: {
    color: themeDefinition.colors.bluefrance[950],
    options: {
      libelleNsf: "Domaine de formation (NSF)",
      libelleFormation: "Formation",
      formationSpecifique: "Formation spécifique",
      libelleNiveauDiplome: "Diplôme",
    },
  },
  // demande
  ["demande"]: {
    color: "#FEE9E5",
    options: {
      typeDemande: "Type de demande",
      motif: "Motif(s) de la demande",
      differenceCapaciteScolaire: "Nombre de places en voie scolaire",
      differenceCapaciteApprentissage: "Nombre de places en apprentissage",
      differenceCapaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
      differenceCapaciteApprentissageColoree: "Nombre de places colorées en apprentissage",
      libelleColoration: "Libellé coloration",
      libelleFCIL: "Libellé FCIL",
      amiCma: "AMI/CMA ?",
      amiCmaValide: "Financement AMI/CMA validé ?",
      amiCmaEnCoursValidation: "Demande de financement AMI/CMA en cours ?",
      amiCmaValideAnnee: "Année de validation de l'AMI/CMA",
      filiereCmq: "Filière CMQ",
      nomCmq: "Nom CMQ",
      inspecteurReferent: "Inspecteur référent",
      commentaire: "Commentaire",
      numero: "N° demande",
      partenaireEconomique1: "Partenaire économique 1",
      partenaireEconomique2: "Partenaire économique 2",
    },
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    color: "#C3FAD5",
    options: {
      positionQuadrant: "Position dans le quadrant",
      tauxInsertionRegional: "Tx d'emploi à 6 mois régional",
      tauxPoursuiteRegional: "Tx de poursuite d'études régional",
      tauxDevenirFavorableRegional: "Tx de devenir favorable régional",
      tauxPressionRegional: "Tx de pression régional",
      nbEtablissement: "Nb établissement",
    },
  },
  // RH
  ["implications RH"]: {
    color: themeDefinition.colors.yellowTournesol[950],
    options: {
      nbRecrutementRH: "Nombre de recrutements",
      nbReconversionRH: "Nombre de reconversions",
      nbProfesseurAssocieRH: "Nombre de professeurs associés",
      nbFormationRH: "Nombre de formations",
    },
  },
  // Travaux et achats
  ["travaux et achats"]: {
    color: themeDefinition.colors.greenArchipel[950],
    options: {
      travauxAmenagement: "Travaux ou aménagement ?",
      travauxAmenagementCout: "Coût des travaux et aménagement",
      travauxAmenagementDescription: "Description des travaux et aménagement",
      achatEquipement: "Achat d'équipement ?",
      achatEquipementCout: "Coût des achats d'équipement",
      achatEquipementDescription: "Description des achats d'équipement",
    },
  },
  // Hébergement
  ["hébergement et restauration"]: {
    color: themeDefinition.colors.grey[950],
    options: {
      augmentationCapaciteAccueilHebergement: "Besoin d'augmentation de la capacité d'hébergement ?",
      augmentationCapaciteAccueilHebergementPlaces: "Nombre de places d'hébergement supplémentaires",
      augmentationCapaciteAccueilHebergementPrecisions: "Précisions sur l'augmentation de la capacité d'hébergement",
      augmentationCapaciteAccueilRestauration: "Besoin d'augmentation de la capacité de restauration ?",
      augmentationCapaciteAccueilRestaurationPlaces: "Nombre de places de restauration supplémentaires",
      augmentationCapaciteAccueilRestaurationPrecisions: "Précisions sur l'augmentation de la capacité de restauration",
    },
  },
  // Statut
  ["statut"]: {
    color: themeDefinition.colors.grey[950],
    options: {
      statut: "Statut",
      motifRefus: "Motif(s) de refus",
    },
  },
  // Pilotage
  ["pilotage"]: {
    color: themeDefinition.colors.bluefrance[950],
    options: {
      // Suivi du taux de remplissage des demandes
      pilotageCapacite: "Capacité RS 2024",
      pilotageEffectif: "Effectif RS 2024",
      pilotageTauxRemplissage: "Remplissage RS 2024",
      pilotageTauxPression: "Tx Pression RS 2024",
      pilotageTauxDemande: "Tx Demande RS 2024",
    },
  },
} as Record<string, { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL> }>;

export const GROUPED_STATS_DEMANDES_COLUMNS_DEFAULT: Record<
  string,
  { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_DEFAULT> }
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
      libelleNiveauDiplome: "Diplôme",
    },
  },
  // demande
  ["demande"]: {
    color: "#FEE9E5",
    options: {
      typeDemande: "Type de demande",
      differenceCapaciteScolaire: "Nombre de places en voie scolaire",
      differenceCapaciteApprentissage: "Nombre de places en apprentissage",
      differenceCapaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
      differenceCapaciteApprentissageColoree: "Nombre de places colorées en apprentissage",
      libelleColoration: "Libellé coloration",
    },
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    color: "#C3FAD5",
    options: {
      positionQuadrant: "Position dans le quadrant",
    },
  },
  ["statut"]: {
    color: themeDefinition.colors.grey[950],
    options: {
      statut: "Statut",
    },
  },
} as Record<string, { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_DEFAULT> }>;
