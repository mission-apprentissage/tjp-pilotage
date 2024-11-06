import { kdb } from "../../../db/db";
import {
  Attractivite_capacite,
  AttractiviteCapaciteSchema,
} from "../fileTypes/Attractivite_capacite";
import {
  BTS_Attractivite_capacite,
  BTSAttractiviteCapaciteSchema,
} from "../fileTypes/BTS_Attractivite_capacite";
import { Certif_Info, CertifInfoSchema } from "../fileTypes/Certif_Info";
import {
  Chomage_departemental_INSEE,
  ChomageDepartementalINSEESchema,
} from "../fileTypes/Chomage_departemental_INSEE";
import {
  Chomage_regional_INSEE,
  ChomageRegionalINSEESchema,
} from "../fileTypes/Chomage_regional_INSEE";
import { Constat, ConstatSchema } from "../fileTypes/Constat";
import {
  Departements_academies_regions,
  DepartementsAcademiesRegionsSchema,
} from "../fileTypes/Departements_academies_regions";
import {
  DiplomeProfessionnelLine,
  DiplomeProfessionnelSchema,
} from "../fileTypes/DiplomesProfessionnels";
import { Discipline, DisciplineSchema } from "../fileTypes/Discipline";
import {
  Domaine_Professionnel,
  DomaineProfessionnelSchema,
} from "../fileTypes/DomaineProfessionnel";
import {
  FamillesMetiersLine,
  FamillesMetiersSchema,
} from "../fileTypes/FamilleMetiers";
import { LyceesACCELine, LyceesACCESchema } from "../fileTypes/LyceesACCELine";
import { Metier, MetierSchema } from "../fileTypes/Metier";
import {
  NDispositifFormation,
  NDispositifFormationSchema,
} from "../fileTypes/NDispositifFormation";
import {
  NFormationDiplomeLine,
  NFormationDiplomeSchema,
} from "../fileTypes/NFormationDiplome";
import { NMefLine, NMefSchema } from "../fileTypes/NMef";
import {
  NNiveauFormationDiplome,
  NNiveauFormationDiplomeSchema,
} from "../fileTypes/NNiveauFormationDiplome";
import {
  NSF_Categorie_Specialite,
  NSFCategorieSpecialiteSchema,
} from "../fileTypes/NSFCategorieSpecialite";
import {
  NSF_Domaine_Specialite,
  NSFDomaineSpecialiteSchema,
} from "../fileTypes/NSFDomaineSpecialite";
import {
  NSF_Groupe_Specialite,
  NSFGroupeSpecialiteSchema,
} from "../fileTypes/NSFGroupeSpecialite";
import {
  Offres_apprentissage,
  OffresApprentissageSchema,
} from "../fileTypes/Offres_apprentissage";
import { OptionsBTSLine, OptionsBTSSchema } from "../fileTypes/OptionsBTS";
import { Regroupement, RegroupementSchema } from "../fileTypes/Regroupement";
import { Rome, RomeSchema } from "../fileTypes/Rome";
import {
  StructureDenseignement,
  StructureDenseignementSchema,
} from "../fileTypes/Structures_denseignement";
import {
  Tension_Departement_Rome,
  TensionDepartementRomeSchema,
} from "../fileTypes/Tension_Departement_rome";
import {
  Tension_Region_Rome,
  TensionRegionRomeSchema,
} from "../fileTypes/Tension_Region_rome";
import {
  VFormationDiplomeLine,
  VFormationDiplomeSchema,
} from "../fileTypes/VFormationDiplome";
import { IjRegionData } from "../services/inserJeunesApi/formatRegionData";
import { IJUaiData } from "../services/inserJeunesApi/formatUaiData";

export const Schemas = {
  regroupements: RegroupementSchema,
  diplomesProfessionnels: DiplomeProfessionnelSchema,
  offresApprentissage: OffresApprentissageSchema,
  nFormationDiplome: NFormationDiplomeSchema,
  vFormationDiplome: VFormationDiplomeSchema,
  familleMetiers: FamillesMetiersSchema,
  optionsBTS: OptionsBTSSchema,
  lyceesACCE: LyceesACCESchema,
  nMef: NMefSchema,
  constat: ConstatSchema,
  departements_academies_regions: DepartementsAcademiesRegionsSchema,
  nNiveauFormationDiplome_: NNiveauFormationDiplomeSchema,
  nDispositifFormation_: NDispositifFormationSchema,
  attractivite_capacite: AttractiviteCapaciteSchema,
  BTS_attractivite_capacite: BTSAttractiviteCapaciteSchema,
  chomage_regional_INSEE: ChomageRegionalINSEESchema,
  chomage_departemental_INSEE: ChomageDepartementalINSEESchema,
  onisep_structures_denseignement_secondaire: StructureDenseignementSchema,
  onisep_structures_denseignement_superieur: StructureDenseignementSchema,
  n_categorie_specialite_: NSFCategorieSpecialiteSchema,
  n_domaine_specialite_: NSFDomaineSpecialiteSchema,
  n_groupe_specialite_: NSFGroupeSpecialiteSchema,
  domaine_professionnel: DomaineProfessionnelSchema,
  rome: RomeSchema,
  metier: MetierSchema,
  certif_info: CertifInfoSchema,
  discipline: DisciplineSchema,
  tension_departement_rome: TensionDepartementRomeSchema,
  tension_region_rome: TensionRegionRomeSchema,
};

export type LineTypes = {
  diplomesProfessionnels: DiplomeProfessionnelLine;
  offres_apprentissage: Offres_apprentissage;
  nFormationDiplome_: NFormationDiplomeLine;
  vFormationDiplome_: VFormationDiplomeLine;
  familleMetiers: FamillesMetiersLine;
  optionsBTS: OptionsBTSLine;
  lyceesACCE: LyceesACCELine;
  nMef: NMefLine;
  constat: Constat;
  departements_academies_regions: Departements_academies_regions;
  nNiveauFormationDiplome_: NNiveauFormationDiplome;
  nDispositifFormation_: NDispositifFormation;
  attractivite_capacite: Attractivite_capacite;
  BTS_attractivite_capacite: BTS_Attractivite_capacite;
  ij: IJUaiData & { uai: string; millesime: string };
  ij_reg: { codeRegion: string; millesime: string } & IjRegionData;
  chomage_regional_INSEE: Chomage_regional_INSEE;
  chomage_departemental_INSEE: Chomage_departemental_INSEE;
  onisep_structures_denseignement_secondaire: StructureDenseignement;
  onisep_structures_denseignement_superieur: StructureDenseignement;
  regroupements: Regroupement;
  n_categorie_specialite_: NSF_Categorie_Specialite;
  n_domaine_specialite_: NSF_Domaine_Specialite;
  n_groupe_specialite_: NSF_Groupe_Specialite;
  domaine_professionnel: Domaine_Professionnel;
  rome: Rome;
  metier: Metier;
  certif_info: Certif_Info;
  discipline: Discipline;
  tension_departement_rome: Tension_Departement_Rome;
  tension_region_rome: Tension_Region_Rome;
};

const findRawData = async <T extends keyof LineTypes>({
  type,
  filter,
  year,
}: {
  type: T;
  filter?: Partial<LineTypes[T]>;
  year?: string;
}) => {
  const item = await kdb
    .selectFrom("rawData")
    .selectAll("rawData")
    .where("type", "=", year ? `${type}_${year}` : type)
    .$call((q) => {
      if (!filter) return q;
      return q.where("data", "@>", filter as never);
    })
    .limit(1)
    .executeTakeFirst();

  return (item?.data ?? undefined) as LineTypes[T] | undefined;
};

const findRawDatas = async <T extends keyof LineTypes>({
  type,
  offset = 0,
  limit,
  filter,
  year,
}: {
  type: T;
  offset?: number;
  limit?: number;
  filter?: Partial<LineTypes[T]>;
  year?: string;
}) => {
  const items = await kdb
    .selectFrom("rawData")
    .selectAll("rawData")
    .where("type", "=", year ? `${type}_${year}` : type)
    .$call((q) => {
      if (!filter) return q;
      return q.where("data", "@>", filter as never);
    })
    .offset(offset)
    .$call((q) => {
      if (!limit) return q;
      return q.limit(limit);
    })
    .orderBy("id", "asc")
    .execute();

  return items.map((item) => item.data as LineTypes[T]);
};

export const rawDataRepository = { findRawData, findRawDatas };
