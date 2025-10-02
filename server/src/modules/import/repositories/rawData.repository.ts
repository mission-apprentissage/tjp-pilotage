import { getKbdClient } from "@/db/db";
import type { Actions_prioritaires } from "@/modules/import/fileTypes/Actions_prioritaires";
import { ActionsPrioritairesSchema } from "@/modules/import/fileTypes/Actions_prioritaires";
import type { Attractivite_capacite } from "@/modules/import/fileTypes/Attractivite_capacite";
import { AttractiviteCapaciteSchema } from "@/modules/import/fileTypes/Attractivite_capacite";
import type { BTS_Attractivite_capacite } from "@/modules/import/fileTypes/BTS_Attractivite_capacite";
import { BTSAttractiviteCapaciteSchema } from "@/modules/import/fileTypes/BTS_Attractivite_capacite";
import type { Certif_Info } from "@/modules/import/fileTypes/Certif_Info";
import { CertifInfoSchema } from "@/modules/import/fileTypes/Certif_Info";
import type { Chomage_departemental_INSEE } from "@/modules/import/fileTypes/Chomage_departemental_INSEE";
import { ChomageDepartementalINSEESchema } from "@/modules/import/fileTypes/Chomage_departemental_INSEE";
import type { Chomage_regional_INSEE } from "@/modules/import/fileTypes/Chomage_regional_INSEE";
import { ChomageRegionalINSEESchema } from "@/modules/import/fileTypes/Chomage_regional_INSEE";
import type { Constat } from "@/modules/import/fileTypes/Constat";
import { ConstatSchema } from "@/modules/import/fileTypes/Constat";
import type { Departements_academies_regions } from "@/modules/import/fileTypes/Departements_academies_regions";
import { DepartementsAcademiesRegionsSchema } from "@/modules/import/fileTypes/Departements_academies_regions";
import type { DiplomeProfessionnelLine } from "@/modules/import/fileTypes/DiplomesProfessionnels";
import { DiplomeProfessionnelSchema } from "@/modules/import/fileTypes/DiplomesProfessionnels";
import type { Discipline } from "@/modules/import/fileTypes/Discipline";
import { DisciplineSchema } from "@/modules/import/fileTypes/Discipline";
import type { Domaine_Professionnel } from "@/modules/import/fileTypes/DomaineProfessionnel";
import { DomaineProfessionnelSchema } from "@/modules/import/fileTypes/DomaineProfessionnel";
import type { FamillesMetiersLine } from "@/modules/import/fileTypes/FamilleMetiers";
import { FamillesMetiersSchema } from "@/modules/import/fileTypes/FamilleMetiers";
import type { LyceesACCELine } from "@/modules/import/fileTypes/LyceesACCELine";
import { LyceesACCESchema } from "@/modules/import/fileTypes/LyceesACCELine";
import type { Metier } from "@/modules/import/fileTypes/Metier";
import { MetierSchema } from "@/modules/import/fileTypes/Metier";
import type { NDispositifFormation } from "@/modules/import/fileTypes/NDispositifFormation";
import { NDispositifFormationSchema } from "@/modules/import/fileTypes/NDispositifFormation";
import type { NFormationDiplomeLine } from "@/modules/import/fileTypes/NFormationDiplome";
import { NFormationDiplomeSchema } from "@/modules/import/fileTypes/NFormationDiplome";
import type { NGroupeFormation } from "@/modules/import/fileTypes/NGroupeFormation";
import { NGroupeFormationSchema } from "@/modules/import/fileTypes/NGroupeFormation";
import type { NLienFormationGroupe } from "@/modules/import/fileTypes/NLienFormationGroupe";
import { NLienFormationGroupeSchema } from "@/modules/import/fileTypes/NLienFormationGroupe";
import type { NMefLine } from "@/modules/import/fileTypes/NMef";
import { NMefSchema } from "@/modules/import/fileTypes/NMef";
import type { NNiveauFormationDiplome } from "@/modules/import/fileTypes/NNiveauFormationDiplome";
import { NNiveauFormationDiplomeSchema } from "@/modules/import/fileTypes/NNiveauFormationDiplome";
import type { NSF_Categorie_Specialite } from "@/modules/import/fileTypes/NSFCategorieSpecialite";
import { NSFCategorieSpecialiteSchema } from "@/modules/import/fileTypes/NSFCategorieSpecialite";
import type { NSF_Domaine_Specialite } from "@/modules/import/fileTypes/NSFDomaineSpecialite";
import { NSFDomaineSpecialiteSchema } from "@/modules/import/fileTypes/NSFDomaineSpecialite";
import type { NSF_Groupe_Specialite } from "@/modules/import/fileTypes/NSFGroupeSpecialite";
import { NSFGroupeSpecialiteSchema } from "@/modules/import/fileTypes/NSFGroupeSpecialite";
import type { NTypeGroupeFormation } from "@/modules/import/fileTypes/NTypeGroupeFormation";
import { NTypeGroupeFormationSchema } from "@/modules/import/fileTypes/NTypeGroupeFormation";
import type { Offres_apprentissage } from "@/modules/import/fileTypes/Offres_apprentissage";
import { OffresApprentissageSchema } from "@/modules/import/fileTypes/Offres_apprentissage";
import type { OptionsBTSLine } from "@/modules/import/fileTypes/OptionsBTS";
import { OptionsBTSSchema } from "@/modules/import/fileTypes/OptionsBTS";
import type { Regroupement } from "@/modules/import/fileTypes/Regroupement";
import { RegroupementSchema } from "@/modules/import/fileTypes/Regroupement";
import type { Rome } from "@/modules/import/fileTypes/Rome";
import { RomeSchema } from "@/modules/import/fileTypes/Rome";
import type { StructureDenseignement } from "@/modules/import/fileTypes/Structures_denseignement";
import { StructureDenseignementSchema } from "@/modules/import/fileTypes/Structures_denseignement";
import type { Tension_Rome } from "@/modules/import/fileTypes/Tension_Rome";
import { TensionRomeSchema } from "@/modules/import/fileTypes/Tension_Rome";
import type { VFormationDiplomeLine } from "@/modules/import/fileTypes/VFormationDiplome";
import { VFormationDiplomeSchema } from "@/modules/import/fileTypes/VFormationDiplome";
import type { IjRegionData } from "@/modules/import/services/inserJeunesApi/formatRegionData";
import type { IJUaiData } from "@/modules/import/services/inserJeunesApi/formatUaiData";

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
  tension_rome_departement: TensionRomeSchema,
  tension_rome_region: TensionRomeSchema,
  tension_rome: TensionRomeSchema,
  actions_prioritaires: ActionsPrioritairesSchema,
  n_groupe_formation_: NGroupeFormationSchema,
  n_type_groupe_formation_: NTypeGroupeFormationSchema,
  n_lien_formation_groupe_: NLienFormationGroupeSchema,
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
  tension_rome_departement: Tension_Rome;
  tension_rome_region: Tension_Rome;
  tension_rome: Tension_Rome;
  actions_prioritaires: Actions_prioritaires;
  n_groupe_formation_: NGroupeFormation;
  n_type_groupe_formation_: NTypeGroupeFormation;
  n_lien_formation_groupe_: NLienFormationGroupe;
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
  const item = await getKbdClient()
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
  const items = await getKbdClient()
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
