import {
  STATS_DEMANDES_COLUMNS,
  STATS_DEMANDES_COLUMNS_DEFAULT,
  STATS_DEMANDES_COLUMNS_OPTIONAL,
} from "@/app/(wrapped)/intentions/restitution/STATS_DEMANDES_COLUMN";

import { themeDefinition } from "../../../../theme/theme";

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
    color: "#EEEEEE",
    cellColor: "#FFFFFF",
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
    },
  },
  // formation
  ["formation"]: {
    color: "#ECECFE",
    cellColor: "#F5F5FE",
    options: {
      cfd: "CFD",
      libelleNsf: "Domaine de formation (NSF)",
      libelleFormation: "Formation",
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
      typeDemande: "Type de demande",
      motif: "Motif(s) de la demande",
      rentreeScolaire: "RS",
      differenceCapaciteScolaire: "Nombre de places en voie scolaire",
      capaciteScolaireActuelle: "Capacité scolaire actuelle",
      capaciteScolaire: "Capacité scolaire",
      capaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
      differenceCapaciteApprentissage: "Nombre de places en apprentissage",
      capaciteApprentissageActuelle: "Capacité apprentissage actuelle",
      capaciteApprentissage: "Capacité apprentissage",
      capaciteApprentissageColoree:
        "Nombre de places colorées en apprentissage",
      libelleColoration: "Libellé coloration",
      libelleFCIL: "Libellé FCIL",
      amiCma: "AMI/CMA ?",
      amiCmaValide: "Financement AMI/CMA validé ?",
      amiCmaEnCoursValidation: "Demande de financement AMI/CMA en cours ?",
      amiCmaValideAnnee: "Année de validation de l'AMI/CMA",
      commentaire: "Commentaire",
      numero: "N° demande",
      createdAt: "Date de création",
      updatedAt: "Date de dernière modification",
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
    color: "#C7F6FC",
    cellColor: "#E5FBFD",
    options: {
      travauxAmenagement: "Travaux ou aménagement ?",
      travauxAmenagementDescription: "Description des travaux et aménagement",
      achatEquipement: "Achat d'équipement ?",
      achatEquipementDescription: "Description des achats d'équipement",
    },
  },
  // Hébergement
  ["hébergement et restauration"]: {
    color: "#FEE7FC",
    cellColor: "#FEF3FD",
    options: {
      augmentationCapaciteAccueilHebergement:
        "Besoin d'augmentation de la capacité d'hébergement ?",
      augmentationCapaciteAccueilHebergementPlaces:
        "Nombre de places d'hébergement supplémentaires",
      augmentationCapaciteAccueilHebergementPrecisions:
        "Précisions sur l'augmentation de la capacité d'hébergement",
      augmentationCapaciteAccueilRestauration:
        "Besoin d'augmentation de la capacité de restauration ?",
      augmentationCapaciteAccueilRestaurationPlaces:
        "Nombre de places de restauration supplémentaires",
      augmentationCapaciteAccueilRestaurationPrecisions:
        "Précisions sur l'augmentation de la capacité de restauration",
    },
  },
  // Statut
  ["statut"]: {
    color: "#EEEEEE",
    cellColor: "#FFFFFF",
    options: {
      statut: "Statut",
      motifRefus: "Motif(s) de refus",
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
  { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL> }
> = {
  // établissement
  ["établissement"]: {
    color: "#EEEEEE",
    options: {
      libelleEtablissement: "Établissement",
      commune: "Commune",
      libelleRegion: "Région",
      libelleAcademie: "Académie",
    },
  },
  // formation
  ["formation"]: {
    color: "#ECECFE",
    options: {
      libelleNsf: "Domaine de formation (NSF)",
      libelleFormation: "Formation",
      niveauDiplome: "Diplôme",
    },
  },
  // demande
  ["demande"]: {
    color: "#C3FAD5",
    options: {
      typeDemande: "Type de demande",
      motif: "Motif(s) de la demande",
      differenceCapaciteScolaire: "Nombre de places en voie scolaire",
      differenceCapaciteApprentissage: "Nombre de places en apprentissage",
      capaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
      capaciteApprentissageColoree:
        "Nombre de places colorées en apprentissage",
      libelleColoration: "Libellé coloration",
      libelleFCIL: "Libellé FCIL",
      amiCma: "AMI/CMA ?",
      commentaire: "Commentaire",
      numero: "N° demande",
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
    color: "#C7F6FC",
    options: {
      travauxAmenagement: "Travaux ou aménagement ?",
      travauxAmenagementDescription: "Description des travaux et aménagement",
      achatEquipement: "Achat d'équipement ?",
      achatEquipementDescription: "Description des achats d'équipement",
    },
  },
  // Hébergement
  ["hébergement et restauration"]: {
    color: "#FEE7FC",
    options: {
      augmentationCapaciteAccueilHebergement:
        "Besoin d'augmentation de la capacité d'hébergement ?",
      augmentationCapaciteAccueilHebergementPlaces:
        "Nombre de places d'hébergement supplémentaires",
      augmentationCapaciteAccueilHebergementPrecisions:
        "Précisions sur l'augmentation de la capacité d'hébergement",
      augmentationCapaciteAccueilRestauration:
        "Besoin d'augmentation de la capacité de restauration ?",
      augmentationCapaciteAccueilRestaurationPlaces:
        "Nombre de places de restauration supplémentaires",
      augmentationCapaciteAccueilRestaurationPrecisions:
        "Précisions sur l'augmentation de la capacité de restauration",
    },
  },
  // Statut
  ["statut"]: {
    color: "#EEEEEE",
    options: {
      statut: "Statut",
      motifRefus: "Motif(s) de refus",
    },
  },
} as Record<
  string,
  { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL> }
>;

export const GROUPED_STATS_DEMANDES_COLUMNS_DEFAULT: Record<
  string,
  { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_DEFAULT> }
> = {
  // établissement
  ["établissement"]: {
    color: "#EEEEEE",
    options: {
      libelleEtablissement: "Établissement",
      commune: "Commune",
    },
  },
  // formation
  ["formation"]: {
    color: "#ECECFE",
    options: {
      libelleNsf: "Domaine de formation (NSF)",
      libelleFormation: "Formation",
      niveauDiplome: "Diplôme",
    },
  },
  // demande
  ["demande"]: {
    color: "#C3FAD5",
    options: {
      typeDemande: "Type de demande",
      differenceCapaciteScolaire: "Nombre de places en voie scolaire",
      differenceCapaciteApprentissage: "Nombre de places en apprentissage",
    },
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    color: "#FEE9E5",
    options: {
      positionQuadrant: "Position dans le quadrant",
    },
  },
  ["statut"]: {
    color: "#EEEEEE",
    options: {
      statut: "Statut",
    },
  },
} as Record<
  string,
  { color: string; options: Partial<typeof STATS_DEMANDES_COLUMNS_DEFAULT> }
>;
