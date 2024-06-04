import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Academie {
  codeAcademie: string;
  libelleAcademie: string;
  codeRegion: string;
}

export interface Avis {
  id: Generated<string>;
  createdBy: string | null;
  intentionNumero: string;
  statutAvis: string;
  typeAvis: string;
  userFonction: string | null;
  isVisibleParTous: boolean;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  commentaire: string | null;
  updatedBy: string | null;
}

export interface Campagne {
  id: Generated<string>;
  annee: string;
  dateDebut: Timestamp | null;
  dateFin: Timestamp | null;
  statut: string;
}

export interface ChangeLog {
  id: Generated<number>;
  date: Generated<Timestamp | null>;
  tableName: string | null;
  operation: string | null;
  user: Generated<string | null>;
  newVal: Json | null;
  oldVal: Json | null;
}

export interface ChangementStatut {
  id: Generated<string>;
  createdBy: string | null;
  intentionNumero: string;
  statutPrecedent: string | null;
  statut: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  commentaire: string | null;
}

export interface ConstatRentree {
  rentreeScolaire: string | null;
  mefstat11: string | null;
  uai: string | null;
  effectif: number | null;
  anneeDispositif: number | null;
  cfd: string | null;
}

export interface DataEtablissement {
  uai: string;
  libelleEtablissement: string | null;
  commune: string | null;
  siret: string | null;
  adresse: string | null;
  codePostal: string | null;
  codeMinistereTutuelle: string | null;
  secteur: string | null;
  codeDepartement: string | null;
  codeAcademie: string | null;
  codeRegion: string | null;
  typeUai:
    | "1ORD"
    | "9999"
    | "ADLE"
    | "AGRI"
    | "AIDE"
    | "APPL"
    | "CDES"
    | "CDP"
    | "CFA"
    | "CFIS"
    | "CFPA"
    | "CLG"
    | "CNED"
    | "CONT"
    | "CSAV"
    | "DIV"
    | "EFE"
    | "EME"
    | "EREA"
    | "ERPD"
    | "ETRA"
    | "EUR"
    | "EXP"
    | "FORP"
    | "GRET"
    | "HOSP"
    | "IEN"
    | "ING"
    | "IO"
    | "IUFM"
    | "JS"
    | "LP"
    | "LYC"
    | "ONIS"
    | "OUS"
    | "PBAC"
    | "PRES"
    | "PRSU"
    | "RECH"
    | "RECT"
    | "SDEN"
    | "SEP"
    | "SERV"
    | "SES"
    | "SET"
    | "SGT"
    | "SMUT"
    | "SOC"
    | "SPEC"
    | "SSEF"
    | "TSGE"
    | "UNIV";
}

export interface DataFormation {
  cfd: string;
  rncp: number | null;
  libelleFormation: string;
  codeNiveauDiplome: string;
  cpc: string | null;
  cpcSecteur: string | null;
  cpcSousSecteur: string | null;
  dateOuverture: Timestamp | null;
  dateFermeture: Timestamp | null;
  typeFamille: "1ere_commune" | "2nde_commune" | "option" | "specialite" | null;
  codeNsf: string | null;
}

export interface Demande {
  numero: string;
  cfd: string | null;
  codeDispositif: string | null;
  uai: string;
  rentreeScolaire: number | null;
  typeDemande: string | null;
  motif: string[] | null;
  autreMotif: string | null;
  coloration: boolean | null;
  libelleColoration: string | null;
  amiCma: boolean | null;
  poursuitePedagogique: boolean | null;
  commentaire: string | null;
  statut: string;
  codeRegion: string;
  codeAcademie: string | null;
  createdBy: string;
  createdAt: Generated<Timestamp>;
  capaciteScolaire: number | null;
  capaciteScolaireActuelle: number | null;
  capaciteScolaireColoree: number | null;
  capaciteApprentissage: number | null;
  capaciteApprentissageActuelle: number | null;
  capaciteApprentissageColoree: number | null;
  mixte: boolean | null;
  compensationUai: string | null;
  compensationCfd: string | null;
  compensationCodeDispositif: string | null;
  compensationRentreeScolaire: number | null;
  updatedAt: Timestamp;
  libelleFCIL: string | null;
  motifRefus: string[] | null;
  autreMotifRefus: string | null;
  campagneId: string | null;
  id: Generated<string>;
  numeroHistorique: string | null;
  amiCmaValide: boolean | null;
  amiCmaValideAnnee: string | null;
  recrutementRH: boolean | null;
  nbRecrutementRH: number | null;
  discipline1RecrutementRH: string | null;
  discipline2RecrutementRH: string | null;
  reconversionRH: boolean | null;
  nbReconversionRH: number | null;
  discipline1ReconversionRH: string | null;
  discipline2ReconversionRH: string | null;
  professeurAssocieRH: boolean | null;
  nbProfesseurAssocieRH: number | null;
  discipline1ProfesseurAssocieRH: string | null;
  discipline2ProfesseurAssocieRH: string | null;
  formationRH: boolean | null;
  nbFormationRH: number | null;
  discipline1FormationRH: string | null;
  discipline2FormationRH: string | null;
  amiCmaEnCoursValidation: boolean | null;
  autreBesoinRH: string | null;
  updatedBy: string | null;
}

export interface Departement {
  codeDepartement: string;
  libelleDepartement: string;
  codeAcademie: string;
  codeRegion: string;
}

export interface DiplomeProfessionnel {
  cfd: string;
  voie: string | null;
}

export interface Discipline {
  codeDiscipline: string;
  libelleDiscipline: string | null;
}

export interface Dispositif {
  codeDispositif: string;
  codeNiveauDiplome: string;
  libelleDispositif: string;
}

export interface DomaineProfessionnel {
  codeDomaineProfessionnel: string;
  libelleDomaineProfessionnel: string;
}

export interface Etablissement {
  id: Generated<string>;
  UAI: string;
  siret: string | null;
  codeAcademie: string | null;
  natureUAI: string | null;
  libelleEtablissement: string | null;
  adresseEtablissement: string | null;
  codePostal: string | null;
  secteur: string | null;
  dateOuverture: Timestamp | null;
  dateFermeture: Timestamp | null;
  codeMinistereTutuelle: string | null;
  codeRegion: string | null;
  codeDepartement: string | null;
  commune: string | null;
  latitude: number | null;
  longitude: number | null;
  sourceGeoloc: string | null;
}

export interface FamilleMetier {
  id: Generated<string>;
  libelleFamille: string;
  codeMinistereTutelle: string;
  cfdFamille: string;
  cfd: string;
}

export interface Formation {
  id: Generated<string>;
  codeFormationDiplome: string;
  rncp: number | null;
  libelleFormation: string;
  codeNiveauDiplome: string;
  dateOuverture: Timestamp;
  dateFermeture: Timestamp | null;
  CPC: string | null;
  cpcSecteur: string | null;
  cpcSousSecteur: string | null;
  libelleFiliere: string | null;
}

export interface FormationEtablissement {
  id: Generated<string>;
  cfd: string;
  UAI: string;
  dispositifId: string | null;
  voie: string;
}

export interface FormationHistorique {
  ancienCFD: string;
  cfd: string;
  voie: string;
}

export interface FormationNonMaterializedView {
  id: string | null;
  cfd: string | null;
  rncp: number | null;
  libelleFormation: string | null;
  codeNiveauDiplome: string | null;
  dateOuverture: Timestamp | null;
  dateFermeture: Timestamp | null;
  cpc: string | null;
  cpcSecteur: string | null;
  cpcSousSecteur: string | null;
  typeFamille: "1ere_commune" | "2nde_commune" | "option" | "specialite" | null;
  voie: string | null;
  codeNsf: string | null;
}

export interface FormationRome {
  cfd: string;
  codeRome: string;
}

export interface IndicateurDepartement {
  codeDepartement: string;
  rentreeScolaire: string;
  tauxChomage: number | null;
}

export interface IndicateurEntree {
  formationEtablissementId: string;
  rentreeScolaire: string;
  effectifs: Json | null;
  anneeDebut: number | null;
  capacites: Json | null;
  premiersVoeux: Json | null;
}

export interface IndicateurEtablissement {
  UAI: string;
  millesime: string;
  valeurAjoutee: number | null;
}

export interface IndicateurRegion {
  codeRegion: string;
  rentreeScolaire: string;
  tauxChomage: number | null;
}

export interface IndicateurRegionSortie {
  cfd: string;
  dispositifId: string | null;
  codeRegion: string;
  voie: string;
  millesimeSortie: string;
  effectifSortie: number | null;
  nbSortants: number | null;
  nbPoursuiteEtudes: number | null;
  nbInsertion6mois: number | null;
  nbInsertion12mois: number | null;
  nbInsertion24mois: number | null;
  cfdContinuum: string | null;
}

export interface IndicateurSortie {
  formationEtablissementId: string;
  millesimeSortie: string;
  reussite: number | null;
  effectifSortie: number | null;
  nbSortants: number | null;
  nbPoursuiteEtudes: number | null;
  nbInsertion6mois: number | null;
  nbInsertion12mois: number | null;
  nbInsertion24mois: number | null;
  cfdContinuum: string | null;
}

export interface Intention {
  numero: string;
  cfd: string | null;
  codeDispositif: string | null;
  uai: string | null;
  rentreeScolaire: number | null;
  typeDemande: string | null;
  motif: string[] | null;
  autreMotif: string | null;
  coloration: boolean | null;
  libelleColoration: string | null;
  amiCma: boolean | null;
  commentaire: string | null;
  statut: string;
  codeRegion: string | null;
  codeAcademie: string | null;
  createdBy: string;
  createdAt: Generated<Timestamp>;
  capaciteScolaire: number | null;
  capaciteScolaireActuelle: number | null;
  capaciteScolaireColoree: number | null;
  capaciteApprentissage: number | null;
  capaciteApprentissageActuelle: number | null;
  capaciteApprentissageColoree: number | null;
  mixte: boolean | null;
  updatedAt: Timestamp;
  libelleFCIL: string | null;
  motifRefus: string[] | null;
  autreMotifRefus: string | null;
  campagneId: string | null;
  id: Generated<string>;
  numeroHistorique: string | null;
  amiCmaValide: boolean | null;
  amiCmaValideAnnee: string | null;
  amiCmaEnCoursValidation: boolean | null;
  recrutementRH: boolean | null;
  nbRecrutementRH: number | null;
  discipline1RecrutementRH: string | null;
  discipline2RecrutementRH: string | null;
  reconversionRH: boolean | null;
  nbReconversionRH: number | null;
  discipline1ReconversionRH: string | null;
  discipline2ReconversionRH: string | null;
  professeurAssocieRH: boolean | null;
  nbProfesseurAssocieRH: number | null;
  discipline1ProfesseurAssocieRH: string | null;
  discipline2ProfesseurAssocieRH: string | null;
  formationRH: boolean | null;
  nbFormationRH: number | null;
  discipline1FormationRH: string | null;
  discipline2FormationRH: string | null;
  partenairesEconomiquesImpliques: boolean | null;
  partenaireEconomique1: string | null;
  partenaireEconomique2: string | null;
  cmqImplique: boolean | null;
  filiereCmq: string | null;
  nomCmq: string | null;
  besoinRHPrecisions: string | null;
  travauxAmenagement: boolean | null;
  travauxAmenagementDescription: string | null;
  achatEquipement: boolean | null;
  achatEquipementDescription: string | null;
  augmentationCapaciteAccueilHebergement: boolean | null;
  augmentationCapaciteAccueilHebergementPlaces: number | null;
  augmentationCapaciteAccueilHebergementPrecisions: string | null;
  augmentationCapaciteAccueilRestauration: boolean | null;
  augmentationCapaciteAccueilRestaurationPlaces: number | null;
  augmentationCapaciteAccueilRestaurationPrecisions: string | null;
  updatedBy: string | null;
  inspecteurReferent: string | null;
}

export interface LatestDemandeIntentionNonMaterializedView {
  numero: string | null;
  cfd: string | null;
  codeDispositif: string | null;
  uai: string | null;
  rentreeScolaire: number | null;
  typeDemande: string | null;
  motif: string[] | null;
  autreMotif: string | null;
  coloration: boolean | null;
  libelleColoration: string | null;
  amiCma: boolean | null;
  amiCmaValide: boolean | null;
  amiCmaEnCoursValidation: boolean | null;
  amiCmaValideAnnee: string | null;
  statut: string | null;
  commentaire: string | null;
  codeRegion: string | null;
  codeAcademie: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Timestamp | null;
  capaciteScolaire: number | null;
  capaciteScolaireActuelle: number | null;
  capaciteScolaireColoree: number | null;
  capaciteApprentissage: number | null;
  capaciteApprentissageActuelle: number | null;
  capaciteApprentissageColoree: number | null;
  mixte: boolean | null;
  updatedAt: Timestamp | null;
  libelleFCIL: string | null;
  motifRefus: string[] | null;
  autreMotifRefus: string | null;
  campagneId: string | null;
  id: string | null;
  numeroHistorique: string | null;
  recrutementRH: boolean | null;
  nbRecrutementRH: number | null;
  discipline1RecrutementRH: string | null;
  discipline2RecrutementRH: string | null;
  reconversionRH: boolean | null;
  nbReconversionRH: number | null;
  discipline1ReconversionRH: string | null;
  discipline2ReconversionRH: string | null;
  professeurAssocieRH: boolean | null;
  nbProfesseurAssocieRH: number | null;
  discipline1ProfesseurAssocieRH: string | null;
  discipline2ProfesseurAssocieRH: string | null;
  formationRH: boolean | null;
  nbFormationRH: number | null;
  discipline1FormationRH: string | null;
  discipline2FormationRH: string | null;
  partenairesEconomiquesImpliques: boolean | null;
  partenaireEconomique1: string | null;
  partenaireEconomique2: string | null;
  cmqImplique: boolean | null;
  filiereCmq: string | null;
  nomCmq: string | null;
  inspecteurReferent: string | null;
  besoinRHPrecisions: string | null;
  travauxAmenagement: boolean | null;
  travauxAmenagementDescription: string | null;
  achatEquipement: boolean | null;
  achatEquipementDescription: string | null;
  augmentationCapaciteAccueilHebergement: boolean | null;
  augmentationCapaciteAccueilHebergementPlaces: number | null;
  augmentationCapaciteAccueilHebergementPrecisions: string | null;
  augmentationCapaciteAccueilRestauration: boolean | null;
  augmentationCapaciteAccueilRestaurationPlaces: number | null;
  augmentationCapaciteAccueilRestaurationPrecisions: string | null;
}

export interface LatestDemandeNonMaterializedView {
  numero: string | null;
  cfd: string | null;
  codeDispositif: string | null;
  uai: string | null;
  rentreeScolaire: number | null;
  typeDemande: string | null;
  motif: string[] | null;
  autreMotif: string | null;
  coloration: boolean | null;
  libelleColoration: string | null;
  amiCma: boolean | null;
  poursuitePedagogique: boolean | null;
  commentaire: string | null;
  statut: string | null;
  codeRegion: string | null;
  codeAcademie: string | null;
  createdBy: string | null;
  createdAt: Timestamp | null;
  capaciteScolaire: number | null;
  capaciteScolaireActuelle: number | null;
  capaciteScolaireColoree: number | null;
  capaciteApprentissage: number | null;
  capaciteApprentissageActuelle: number | null;
  capaciteApprentissageColoree: number | null;
  mixte: boolean | null;
  compensationUai: string | null;
  compensationCfd: string | null;
  compensationCodeDispositif: string | null;
  compensationRentreeScolaire: number | null;
  updatedAt: Timestamp | null;
  libelleFCIL: string | null;
  motifRefus: string[] | null;
  autreMotifRefus: string | null;
  campagneId: string | null;
  id: string | null;
  numeroHistorique: string | null;
  amiCmaValide: boolean | null;
  amiCmaValideAnnee: string | null;
  recrutementRH: boolean | null;
  nbRecrutementRH: number | null;
  discipline1RecrutementRH: string | null;
  discipline2RecrutementRH: string | null;
  reconversionRH: boolean | null;
  nbReconversionRH: number | null;
  discipline1ReconversionRH: string | null;
  discipline2ReconversionRH: string | null;
  professeurAssocieRH: boolean | null;
  nbProfesseurAssocieRH: number | null;
  discipline1ProfesseurAssocieRH: string | null;
  discipline2ProfesseurAssocieRH: string | null;
  formationRH: boolean | null;
  nbFormationRH: number | null;
  discipline1FormationRH: string | null;
  discipline2FormationRH: string | null;
  amiCmaEnCoursValidation: boolean | null;
  autreBesoinRH: string | null;
  updatedBy: string | null;
}

export interface LatestIntentionNonMaterializedView {
  numero: string | null;
  cfd: string | null;
  codeDispositif: string | null;
  uai: string | null;
  rentreeScolaire: number | null;
  typeDemande: string | null;
  motif: string[] | null;
  autreMotif: string | null;
  coloration: boolean | null;
  libelleColoration: string | null;
  amiCma: boolean | null;
  commentaire: string | null;
  statut: string | null;
  codeRegion: string | null;
  codeAcademie: string | null;
  createdBy: string | null;
  createdAt: Timestamp | null;
  capaciteScolaire: number | null;
  capaciteScolaireActuelle: number | null;
  capaciteScolaireColoree: number | null;
  capaciteApprentissage: number | null;
  capaciteApprentissageActuelle: number | null;
  capaciteApprentissageColoree: number | null;
  mixte: boolean | null;
  updatedAt: Timestamp | null;
  libelleFCIL: string | null;
  motifRefus: string[] | null;
  autreMotifRefus: string | null;
  campagneId: string | null;
  id: string | null;
  numeroHistorique: string | null;
  amiCmaValide: boolean | null;
  amiCmaValideAnnee: string | null;
  amiCmaEnCoursValidation: boolean | null;
  recrutementRH: boolean | null;
  nbRecrutementRH: number | null;
  discipline1RecrutementRH: string | null;
  discipline2RecrutementRH: string | null;
  reconversionRH: boolean | null;
  nbReconversionRH: number | null;
  discipline1ReconversionRH: string | null;
  discipline2ReconversionRH: string | null;
  professeurAssocieRH: boolean | null;
  nbProfesseurAssocieRH: number | null;
  discipline1ProfesseurAssocieRH: string | null;
  discipline2ProfesseurAssocieRH: string | null;
  formationRH: boolean | null;
  nbFormationRH: number | null;
  discipline1FormationRH: string | null;
  discipline2FormationRH: string | null;
  partenairesEconomiquesImpliques: boolean | null;
  partenaireEconomique1: string | null;
  partenaireEconomique2: string | null;
  cmqImplique: boolean | null;
  filiereCmq: string | null;
  nomCmq: string | null;
  besoinRHPrecisions: string | null;
  travauxAmenagement: boolean | null;
  travauxAmenagementDescription: string | null;
  achatEquipement: boolean | null;
  achatEquipementDescription: string | null;
  augmentationCapaciteAccueilHebergement: boolean | null;
  augmentationCapaciteAccueilHebergementPlaces: number | null;
  augmentationCapaciteAccueilHebergementPrecisions: string | null;
  augmentationCapaciteAccueilRestauration: boolean | null;
  augmentationCapaciteAccueilRestaurationPlaces: number | null;
  augmentationCapaciteAccueilRestaurationPrecisions: string | null;
  updatedBy: string | null;
  inspecteurReferent: string | null;
}

export interface Metier {
  codeMetier: string;
  codeRome: string;
  libelleMetier: string;
}

export interface NiveauDiplome {
  codeNiveauDiplome: string;
  libelleNiveauDiplome: string | null;
}

export interface Nsf {
  codeNsf: string;
  libelleNsf: string;
}

export interface RawData {
  type: string;
  data: Json | null;
  id: Generated<string | null>;
}

export interface Region {
  codeRegion: string;
  libelleRegion: string;
}

export interface Rome {
  codeRome: string;
  libelleRome: string;
  codeDomaineProfessionnel: string;
}

export interface Suivi {
  id: Generated<string>;
  intentionNumero: string;
  userId: string;
  createdAt: Generated<Timestamp>;
}

export interface User {
  id: Generated<string>;
  email: string;
  firstname: string | null;
  lastname: string | null;
  password: string | null;
  createdAt: Generated<Timestamp | null>;
  role: string | null;
  codeRegion: string | null;
  uais: string[] | null;
  enabled: Generated<boolean>;
  sub: string | null;
  lastSeenAt: Timestamp | null;
}

export interface DB {
  academie: Academie;
  avis: Avis;
  campagne: Campagne;
  changeLog: ChangeLog;
  changementStatut: ChangementStatut;
  constatRentree: ConstatRentree;
  dataEtablissement: DataEtablissement;
  dataFormation: DataFormation;
  demande: Demande;
  departement: Departement;
  diplomeProfessionnel: DiplomeProfessionnel;
  discipline: Discipline;
  dispositif: Dispositif;
  domaineProfessionnel: DomaineProfessionnel;
  etablissement: Etablissement;
  familleMetier: FamilleMetier;
  formation: Formation;
  formationEtablissement: FormationEtablissement;
  formationHistorique: FormationHistorique;
  formationNonMaterializedView: FormationNonMaterializedView;
  formationRome: FormationRome;
  indicateurDepartement: IndicateurDepartement;
  indicateurEntree: IndicateurEntree;
  indicateurEtablissement: IndicateurEtablissement;
  indicateurRegion: IndicateurRegion;
  indicateurRegionSortie: IndicateurRegionSortie;
  indicateurSortie: IndicateurSortie;
  intention: Intention;
  latestDemandeIntentionNonMaterializedView: LatestDemandeIntentionNonMaterializedView;
  latestDemandeNonMaterializedView: LatestDemandeNonMaterializedView;
  latestIntentionNonMaterializedView: LatestIntentionNonMaterializedView;
  metier: Metier;
  niveauDiplome: NiveauDiplome;
  nsf: Nsf;
  rawData: RawData;
  region: Region;
  rome: Rome;
  suivi: Suivi;
  user: User;
}
