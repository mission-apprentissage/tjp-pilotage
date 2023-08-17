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
}

export interface DB {
  academie: Academie;
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
