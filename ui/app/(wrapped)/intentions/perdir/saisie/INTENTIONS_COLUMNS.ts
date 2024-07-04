import { client } from "@/api.client";
import { ExportColumns } from "@/utils/downloadExport";

export const INTENTIONS_COLUMNS = {
  numero: "numero",
  cfd: "CFD",
  libelleFormation: "Diplôme",
  codeDispositif: "Code dispositif",
  libelleDispositif: "Dispositif",
  libelleFCIL: "Libellé de la FCIL",
  uai: "UAI",
  libelleEtablissement: "Établissement",
  codeRegion: "Code Region",
  libelleRegion: "Région",
  codeAcademie: "Code Académie",
  libelleAcademie: "Académie",
  codeDepartement: "Code Département",
  libelleDepartement: "Dpt.",
  rentreeScolaire: "RS",
  typeDemande: "Type",
  motif: "Motif",
  autreMotif: "Autre motif",
  coloration: "Coloration",
  libelleColoration: "Libelle coloration",
  amiCma: "AMI/CMA ?",
  poursuitePedagogique: "Poursuite pédagogique ?",
  commentaire: "Commentaire",
  statut: "Statut",
  createdAt: "Date de création",
  updatedAt: "Der. modif.",
  compensationCfd: "CFD compensé",
  compensationUai: "UAI compensé",
  compensationCodeDispositif: "Dispositif compensé",
  capaciteScolaireActuelle: "Capacité scolaire actuelle",
  capaciteScolaire: "Capacité scolaire",
  capaciteScolaireColoree: "Capacité scolaire coloree",
  capaciteApprentissageActuelle: "Capacité apprentissage actuelle",
  capaciteApprentissage: "Capacité apprentissage",
  capaciteApprentissageColoree: "Capacité apprentissage coloree",
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
  userName: "Auteur",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/demandes"]["demandes"][number]
>;
