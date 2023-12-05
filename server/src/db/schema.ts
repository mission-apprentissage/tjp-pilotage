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
  libelle: string;
  codeRegion: string;
}

export interface DataEtablissement {
  uai: string;
  libelle: string | null;
  commune: string | null;
  siret: string | null;
  adresse: string | null;
  codePostal: string | null;
  codeMinistereTutuelle: string | null;
  secteur: string | null;
  codeDepartement: string | null;
  codeAcademie: string | null;
  codeRegion: string | null;
  typeUai: "1ORD" | "9999" | "ADLE" | "AGRI" | "AIDE" | "APPL" | "CDES" | "CDP" | "CFA" | "CFIS" | "CFPA" | "CLG" | "CNED" | "CONT" | "CSAV" | "DIV" | "EFE" | "EME" | "EREA" | "ERPD" | "ETRA" | "EUR" | "EXP" | "FORP" | "GRET" | "HOSP" | "IEN" | "ING" | "IO" | "IUFM" | "JS" | "LP" | "LYC" | "ONIS" | "OUS" | "PBAC" | "PRES" | "PRSU" | "RECH" | "RECT" | "SDEN" | "SEP" | "SERV" | "SES" | "SET" | "SGT" | "SMUT" | "SOC" | "SPEC" | "SSEF" | "TSGE" | "UNIV";
}

export interface DataFormation {
  cfd: string;
  rncp: number | null;
  libelle: string;
  codeNiveauDiplome: string;
  cpc: string | null;
  cpcSecteur: string | null;
  cpcSousSecteur: string | null;
  libelleFiliere: string | null;
  dateOuverture: Timestamp | null;
  dateFermeture: Timestamp | null;
  typeFamille: "2nde_commune" | "specialite" | null;
}

export interface Demande {
  id: string;
  cfd: string | null;
  dispositifId: string | null;
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
  status: "draft" | "refused" | "submitted";
  codeRegion: string;
  codeAcademie: string | null;
  createurId: string;
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
  compensationDispositifId: string | null;
  compensationRentreeScolaire: number | null;
  updatedAt: Timestamp;
  libelleFCIL: string | null;
}

export interface Departement {
  codeDepartement: string;
  libelle: string;
  codeAcademie: string;
  codeRegion: string;
}

export interface Dispositif {
  codeDispositif: string;
  codeNiveauDiplome: string;
  libelleDispositif: string;
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
}

export interface FamilleMetier {
  id: Generated<string>;
  libelleOfficielFamille: string;
  libelleOfficielSpecialite: string;
  codeMinistereTutelle: string;
  mefStat11Famille: string;
  mefStat11Specialite: string;
  cfdFamille: string;
  cfdSpecialite: string;
}

export interface Formation {
  id: Generated<string>;
  codeFormationDiplome: string;
  rncp: number | null;
  libelleDiplome: string;
  codeNiveauDiplome: string;
  dateOuverture: Timestamp;
  dateFermeture: Timestamp | null;
  CPC: string | null;
  CPCSecteur: string | null;
  CPCSousSecteur: string | null;
  libelleFiliere: string | null;
}

export interface FormationEtablissement {
  id: Generated<string>;
  cfd: string;
  UAI: string;
  dispositifId: string;
  voie: string;
}

export interface FormationHistorique {
  codeFormationDiplome: string;
  ancienCFD: string;
}

export interface IndicateurAcademie {
  codeAcademie: string;
  rentreeScolaire: string;
  nbDecrocheurs: number | null;
  effectifDecrochage: number | null;
  tauxDecrochage: number | null;
}

export interface IndicateurEntree {
  formationEtablissementId: string;
  rentreeScolaire: string;
  capacite: number | null;
  effectifEntree: number | null;
  nbPremiersVoeux: number | null;
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
  nbDecrocheurs: number | null;
  effectifDecrochage: number | null;
  tauxDecrochage: number | null;
}

export interface IndicateurRegionSortie {
  cfd: string;
  dispositifId: string;
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

export interface NiveauDiplome {
  codeNiveauDiplome: string;
  libelleNiveauDiplome: string | null;
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

export interface User {
  id: Generated<string>;
  email: string;
  firstname: string | null;
  lastname: string | null;
  password: string | null;
  createdAt: Generated<Timestamp | null>;
  role: string | null;
  codeRegion: string | null;
}

export interface DB {
  academie: Academie;
  dataEtablissement: DataEtablissement;
  dataFormation: DataFormation;
  demande: Demande;
  departement: Departement;
  dispositif: Dispositif;
  etablissement: Etablissement;
  familleMetier: FamilleMetier;
  formation: Formation;
  formationEtablissement: FormationEtablissement;
  formationHistorique: FormationHistorique;
  indicateurAcademie: IndicateurAcademie;
  indicateurEntree: IndicateurEntree;
  indicateurEtablissement: IndicateurEtablissement;
  indicateurRegion: IndicateurRegion;
  indicateurRegionSortie: IndicateurRegionSortie;
  indicateurSortie: IndicateurSortie;
  niveauDiplome: NiveauDiplome;
  rawData: RawData;
  region: Region;
  user: User;
}
