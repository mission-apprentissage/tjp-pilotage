import { client } from "@/api.client";
import { ExportColumns } from "@/utils/downloadExport";

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
  // formation
  cfd: "CFD",
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  codeDispositif: "Code Dispositif",
  libelleDispositif: "Dispositif",
  niveauDiplome: "Diplôme",
  // demande
  typeDemande: "Type de demande",
  motif: "Motif(s) de la demande",
  autreMotif: "Autre motif",
  rentreeScolaire: "RS",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  capaciteScolaireActuelle: "Capacité scolaire actuelle",
  capaciteScolaire: "Capacité scolaire",
  capaciteScolaireColoree: "Capacité scolaire coloree",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  capaciteApprentissageActuelle: "Capacité apprentissage actuelle",
  capaciteApprentissage: "Capacité apprentissage",
  capaciteApprentissageColoree: "Capacité apprentissage coloree",
  libelleColoration: "Libellé coloration",
  libelleFCIL: "Libellé FCIL",
  amiCma: "AMI/CMA ?",
  amiCmaValide: "Financement AMI/CMA validé ?",
  amiCmaEnCoursValidation: "Financement AMI/CMA en cours de validation ?",
  amiCmaValideAnnee: "Année de validation de l'AMI/CMA",
  commentaire: "Commentaire",
  numero: "N° demande",
  statut: "Statut",
  poursuitePedagogique: "Poursuite pédagogique ?",
  createdAt: "Date de création",
  updatedAt: "Date de dernière modification",
  compensationCfd: "CFD compensé",
  compensationCodeDispositif: "Dispositif compensé",
  compensationUai: "UAI compensé",
  motifRefus: "Motif(s) de refus",
  autreMotifRefus: "Autre motif de refus",
  // Devenir favorable de la formation
  positionQuadrant: "Position dans le quadrant",
  tauxInsertion: "Tx d'emploi à 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  devenirFavorable: "Tx de devenir favorable régional",
  pression: "Tx de pression régional",
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
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/restitution-intentions/demandes"]["demandes"][number] & {
    disciplinesRecrutementRH: string;
    disciplinesReconversionRH: string;
    disciplinesProfesseurAssocieRH: string;
    disciplinesFormationRH: string;
  }
>;

export const STATS_DEMANDES_COLUMNS_OPTIONAL: Partial<
  typeof STATS_DEMANDES_COLUMNS
> = {
  libelleEtablissement: "Établissement",
  commune: "Commune",
  libelleRegion: "Région",
  libelleAcademie: "Académie",
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  niveauDiplome: "Diplôme",
  typeDemande: "Type de demande",
  motif: "Motif(s) de la demande",
  autreMotif: "Autre motif",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  libelleColoration: "Libellé coloration",
  libelleFCIL: "Libellé FCIL",
  amiCma: "AMI/CMA ?",
  commentaire: "Commentaire",
  numero: "N° demande",
  statut: "Statut",
  positionQuadrant: "Position dans le quadrant",
  tauxInsertion: "Tx d'emploi à 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  devenirFavorable: "Tx de devenir favorable régional",
  pression: "Tx de pression régional",
  nbEtablissement: "Nb établissement",
  nbRecrutementRH: "Nombre de recrutements",
  nbReconversionRH: "Nombre de reconversions",
  nbProfesseurAssocieRH: "Nombre de professeurs associés",
  nbFormationRH: "Nombre de formations",
} as Partial<typeof STATS_DEMANDES_COLUMNS>;

export const STATS_DEMANDES_COLUMNS_DEFAULT: Partial<
  typeof STATS_DEMANDES_COLUMNS_OPTIONAL
> = {
  libelleEtablissement: "Établissement",
  commune: "Commune",
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  niveauDiplome: "Diplôme",
  typeDemande: "Type de demande",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  statut: "Statut",
  positionQuadrant: "Position dans le quadrant",
} as Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL>;

export const GROUPED_STATS_DEMANDES_COLUMNS: Record<
  string,
  Partial<typeof STATS_DEMANDES_COLUMNS>
> = {
  // établissement
  ["établissement"]: {
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
  // formation
  ["formation"]: {
    cfd: "CFD",
    libelleNsf: "Domaine de formation (NSF)",
    libelleFormation: "Formation",
    codeDispositif: "Code Dispositif",
    libelleDispositif: "Dispositif",
    niveauDiplome: "Diplôme",
  },
  // demande
  ["demande"]: {
    typeDemande: "Type de demande",
    motif: "Motif(s) de la demande",
    autreMotif: "Autre motif",
    rentreeScolaire: "RS",
    differenceCapaciteScolaire: "Nombre de places en voie scolaire",
    capaciteScolaireActuelle: "Capacité scolaire actuelle",
    capaciteScolaire: "Capacité scolaire",
    capaciteScolaireColoree: "Capacité scolaire coloree",
    differenceCapaciteApprentissage: "Nombre de places en apprentissage",
    capaciteApprentissageActuelle: "Capacité apprentissage actuelle",
    capaciteApprentissage: "Capacité apprentissage",
    capaciteApprentissageColoree: "Capacité apprentissage coloree",
    libelleColoration: "Libellé coloration",
    libelleFCIL: "Libellé FCIL",
    amiCma: "AMI/CMA ?",
    amiCmaValide: "Financement AMI/CMA validé ?",
    amiCmaEnCoursValidation: "Financement AMI/CMA en cours de validation ?",
    amiCmaValideAnnee: "Année de validation de l'AMI/CMA",
    commentaire: "Commentaire",
    numero: "N° demande",
    statut: "Statut",
    poursuitePedagogique: "Poursuite pédagogique ?",
    createdAt: "Date de création",
    updatedAt: "Date de dernière modification",
    compensationCfd: "CFD compensé",
    compensationCodeDispositif: "Dispositif compensé",
    compensationUai: "UAI compensé",
    motifRefus: "Motif(s) de refus",
    autreMotifRefus: "Autre motif de refus",
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    positionQuadrant: "Position dans le quadrant",
    tauxInsertion: "Tx d'emploi à 6 mois régional",
    tauxPoursuite: "Tx de poursuite d'études régional",
    devenirFavorable: "Tx de devenir favorable régional",
    pression: "Tx de pression régional",
    nbEtablissement: "Nb établissement",
  },
  // RH
  ["RH"]: {
    recrutementRH: "Recrutement(s) ?",
    nbRecrutementRH: "Nombre de recrutements",
    disciplinesRecrutementRH: "Disciplines des recrutements",
    reconversionRH: "Reconversion(s) ?",
    nbReconversionRH: "Nombre de reconversions",
    disciplinesReconversionRH: "Disciplines des reconversions",
    professeurAssocieRH: "Professeur(s) associé(s) ?",
    nbProfesseurAssocieRH: "Nombre de professeurs associés",
    disciplinesProfesseurAssocieRH: "Disciplines des professeurs associés",
    formationRH: "Formation(s) ?",
    nbFormationRH: "Nombre de formations",
    disciplinesFormationRH: "Disciplines des formations",
  },
} as Record<string, Partial<typeof STATS_DEMANDES_COLUMNS>>;

export const GROUPED_STATS_DEMANDES_COLUMNS_OPTIONAL: Record<
  string,
  Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL>
> = {
  // établissement
  ["établissement"]: {
    libelleEtablissement: "Établissement",
    commune: "Commune",
    libelleRegion: "Région",
    libelleAcademie: "Académie",
  },
  // formation
  ["formation"]: {
    libelleNsf: "Domaine de formation (NSF)",
    libelleFormation: "Formation",
    niveauDiplome: "Diplôme",
  },
  // demande
  ["demande"]: {
    typeDemande: "Type de demande",
    motif: "Motif(s) de la demande",
    autreMotif: "Autre motif",
    differenceCapaciteScolaire: "Nombre de places en voie scolaire",
    differenceCapaciteApprentissage: "Nombre de places en apprentissage",
    libelleColoration: "Libellé coloration",
    libelleFCIL: "Libellé FCIL",
    amiCma: "AMI/CMA ?",
    commentaire: "Commentaire",
    numero: "N° demande",
    statut: "Statut",
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    positionQuadrant: "Position dans le quadrant",
    tauxInsertion: "Tx d'emploi à 6 mois régional",
    tauxPoursuite: "Tx de poursuite d'études régional",
    devenirFavorable: "Tx de devenir favorable régional",
    pression: "Tx de pression régional",
    nbEtablissement: "Nb établissement",
  },
  // RH
  ["RH"]: {
    nbRecrutementRH: "Nombre de recrutements",
    nbReconversionRH: "Nombre de reconversions",
    nbProfesseurAssocieRH: "Nombre de professeurs associés",
    nbFormationRH: "Nombre de formations",
  },
} as Record<string, Partial<typeof STATS_DEMANDES_COLUMNS_OPTIONAL>>;

export const GROUPED_STATS_DEMANDES_COLUMNS_DEFAULT: Record<
  string,
  Partial<typeof STATS_DEMANDES_COLUMNS_DEFAULT>
> = {
  // établissement
  ["établissement"]: {
    libelleEtablissement: "Établissement",
    commune: "Commune",
  },
  // formation
  ["formation"]: {
    libelleNsf: "Domaine de formation (NSF)",
    libelleFormation: "Formation",
    niveauDiplome: "Diplôme",
  },
  // demande
  ["demande"]: {
    typeDemande: "Type de demande",
    differenceCapaciteScolaire: "Nombre de places en voie scolaire",
    differenceCapaciteApprentissage: "Nombre de places en apprentissage",
    statut: "Statut",
  },
  // Devenir favorable de la formation
  ["devenir favorable de la formation"]: {
    positionQuadrant: "Position dans le quadrant",
  },
} as Record<string, Partial<typeof STATS_DEMANDES_COLUMNS_DEFAULT>>;
