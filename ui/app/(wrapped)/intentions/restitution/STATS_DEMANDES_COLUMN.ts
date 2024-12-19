import type { client } from "@/api.client";
import type { ExportColumns } from "@/utils/downloadExport";

export const STATS_DEMANDES_COLUMNS = {
  // établissement
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
  // formation
  cfd: "CFD",
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  formationSpecifique: "Formation spécifique",
  actionPrioritaire: "Action prioritaire ?",
  transitionDemographique: "Transition démographique ?",
  transitionEcologique: "Transition écologique ?",
  transitionNumerique: "Transition numérique ?",
  codeDispositif: "Code Dispositif",
  libelleDispositif: "Dispositif",
  niveauDiplome: "Diplôme",
  // demande
  typeDemande: "Type de demande",
  motif: "Motif(s) de la demande",
  autreMotif: "Autre motif",
  rentreeScolaire: "RS",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  differenceCapaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  differenceCapaciteApprentissageColoree: "Nombre de places colorées en apprentissage",
  capaciteScolaireActuelle: "Capacité en voie scolaire actuelle",
  capaciteScolaire: "Future capacité en voie scolaire",
  capaciteApprentissageActuelle: "Capacité en apprentissage actuelle",
  capaciteApprentissage: "Future capacité en apprentissage",
  capaciteScolaireColoreeActuelle: "Capacité colorée actuelle en voie scolaire",
  capaciteScolaireColoree: "Future capacité colorée en voie scolaire",
  capaciteApprentissageColoreeActuelle: "Capacité colorée actuelle en apprentissage",
  capaciteApprentissageColoree: "Future capacité colorée en apprentissage",
  libelleColoration: "Libellé coloration",
  libelleFCIL: "Libellé FCIL",
  amiCma: "AMI/CMA ?",
  amiCmaValide: "Financement AMI/CMA validé ?",
  amiCmaEnCoursValidation: "Demande de financement AMI/CMA en cours ?",
  amiCmaValideAnnee: "Année de validation de l'AMI/CMA",
  partenaireEconomique1: "Partenaire économique 1",
  partenaireEconomique2: "Partenaire économique 2",
  filiereCmq: "Filière CMQ",
  nomCmq: "Nom CMQ",
  inspecteurReferent: "Inspecteur référent",
  commentaire: "Commentaire",
  numero: "N° demande",
  createdAt: "Date de création",
  updatedAt: "Date de dernière modification",
  // Devenir favorable de la formation
  positionQuadrant: "Position dans le quadrant",
  tauxInsertionRegional: "Tx d'emploi à 6 mois régional",
  tauxPoursuiteRegional: "Tx de poursuite d'études régional",
  tauxDevenirFavorableRegional: "Tx de devenir favorable régional",
  tauxPressionRegional: "Tx de pression régional",
  nbEtablissement: "Nb établissement",
  // RH
  nbRecrutementRH: "Nombre de recrutements",
  disciplinesRecrutementRH: "Disciplines des recrutements",
  nbReconversionRH: "Nombre de reconversions",
  disciplinesReconversionRH: "Disciplines des reconversions",
  nbProfesseurAssocieRH: "Nombre de professeurs associés",
  disciplinesProfesseurAssocieRH: "Disciplines des professeurs associés",
  nbFormationRH: "Nombre de formations",
  disciplinesFormationRH: "Disciplines des formations",
  // Travaux et achats
  travauxAmenagement: "Travaux ou aménagement ?",
  travauxAmenagementCout: "Coût des travaux et aménagement",
  travauxAmenagementDescription: "Description des travaux et aménagement",
  achatEquipement: "Achat d'équipement ?",
  achatEquipementCout: "Coût des achats d'équipement",
  achatEquipementDescription: "Description des achats d'équipement",
  // Hébergement
  augmentationCapaciteAccueilHebergement: "Besoin d'augmentation de la capacité d'hébergement ?",
  augmentationCapaciteAccueilHebergementPlaces: "Nombre de places d'hébergement supplémentaires",
  augmentationCapaciteAccueilHebergementPrecisions: "Précisions sur l'augmentation de la capacité d'hébergement",
  augmentationCapaciteAccueilRestauration: "Besoin d'augmentation de la capacité de restauration ?",
  augmentationCapaciteAccueilRestaurationPlaces: "Nombre de places de restauration supplémentaires",
  augmentationCapaciteAccueilRestaurationPrecisions: "Précisions sur l'augmentation de la capacité de restauration",
  // Statut
  statut: "Statut",
  motifRefus: "Motif(s) de refus",
  autreMotifRefus: "Autre motif de refus",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/restitution-intentions/demandes"]["demandes"][number] & {
    disciplinesRecrutementRH: string;
    disciplinesReconversionRH: string;
    disciplinesProfesseurAssocieRH: string;
    disciplinesFormationRH: string;
    inspecteurReferent: string;
    formationSpecifique: string;
    actionPrioritaire: boolean;
    transitionDemographique: boolean;
    transitionEcologique: boolean;
    transitionNumerique: boolean;
  }
>;

export const STATS_DEMANDES_COLUMNS_OPTIONAL: Partial<typeof STATS_DEMANDES_COLUMNS> = {
  // établissement
  libelleEtablissement: "Établissement",
  commune: "Commune",
  libelleRegion: "Région",
  libelleAcademie: "Académie",
  libelleDepartement: "Département",
  secteur: "Secteur Privé ou Public",
  // formation
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  formationSpecifique: "Formation spécifique",
  niveauDiplome: "Diplôme",
  // demande
  typeDemande: "Type de demande",
  motif: "Motif(s) de la demande",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  differenceCapaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  differenceCapaciteApprentissageColoree: "Nombre de places colorées en apprentissage",
  libelleColoration: "Libellé coloration",
  libelleFCIL: "Libellé FCIL",
  amiCma: "AMI/CMA ?",
  amiCmaValide: "Financement AMI/CMA validé ?",
  amiCmaEnCoursValidation: "Demande de financement AMI/CMA en cours ?",
  amiCmaValideAnnee: "Année de validation de l'AMI/CMA",
  partenaireEconomique1: "Partenaire économique 1",
  partenaireEconomique2: "Partenaire économique 2",
  filiereCmq: "Filière CMQ",
  nomCmq: "Nom CMQ",
  inspecteurReferent: "Inspecteur référent",
  commentaire: "Commentaire",
  numero: "N° demande",
  // Devenir favorable de la formation
  positionQuadrant: "Position dans le quadrant",
  tauxInsertionRegional: "Tx d'emploi à 6 mois régional",
  tauxPoursuiteRegional: "Tx de poursuite d'études régional",
  tauxDevenirFavorableRegional: "Tx de devenir favorable régional",
  tauxPressionRegional: "Tx de pression régional",
  nbEtablissement: "Nb établissement",
  // RH
  nbRecrutementRH: "Nombre de recrutements",
  nbReconversionRH: "Nombre de reconversions",
  nbProfesseurAssocieRH: "Nombre de professeurs associés",
  nbFormationRH: "Nombre de formations",
  // Travaux et achats
  travauxAmenagement: "Travaux ou aménagement ?",
  travauxAmenagementCout: "Coût des travaux et aménagement",
  travauxAmenagementDescription: "Description des travaux et aménagement",
  achatEquipement: "Achat d'équipement ?",
  achatEquipementCout: "Coût des achats d'équipement",
  achatEquipementDescription: "Description des achats d'équipement",
  // Hébergement
  augmentationCapaciteAccueilHebergement: "Besoin d'augmentation de la capacité d'hébergement ?",
  augmentationCapaciteAccueilHebergementPlaces: "Nombre de places d'hébergement supplémentaires",
  augmentationCapaciteAccueilHebergementPrecisions: "Précisions sur l'augmentation de la capacité d'hébergement",
  augmentationCapaciteAccueilRestauration: "Besoin d'augmentation de la capacité de restauration ?",
  augmentationCapaciteAccueilRestaurationPlaces: "Nombre de places de restauration supplémentaires",
  augmentationCapaciteAccueilRestaurationPrecisions: "Précisions sur l'augmentation de la capacité de restauration",
  // Statut
  statut: "Statut",
  motifRefus: "Motif(s) de refus",
  autreMotifRefus: "Autre motif de refus",
} as Partial<typeof STATS_DEMANDES_COLUMNS>;

export const STATS_DEMANDES_COLUMNS_DEFAULT: Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL> = {
  libelleEtablissement: "Établissement",
  commune: "Commune",
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  niveauDiplome: "Diplôme",
  typeDemande: "Type de demande",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  differenceCapaciteScolaireColoree: "Nombre de places colorées en voie scolaire",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  differenceCapaciteApprentissageColoree: "Nombre de places colorées en apprentissage",
  libelleColoration: "Libellé coloration",
  positionQuadrant: "Position dans le quadrant",
  statut: "Statut",
} as Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL>;
