import { kdb } from "../../../db/db";
import { Attractivite_capacite } from "../fileTypes/Attractivite_capacite";
import { BTS_Attractivite_capacite } from "../fileTypes/BTS_Attractivite_capacite";
import { Chomage_departemental_INSEE } from "../fileTypes/Chomage_departemental_INSEE";
import { Chomage_regional_INSEE } from "../fileTypes/Chomage_regional_INSEE";
import { Constat } from "../fileTypes/Constat";
import { Departements_academies_regions } from "../fileTypes/Departements_academies_regions";
import { DiplomeProfessionnelLine } from "../fileTypes/DiplomesProfessionnels";
import { FamillesMetiersLine } from "../fileTypes/FamilleMetiers";
import { LyceesACCELine } from "../fileTypes/LyceesACCELine";
import { NDispositifFormation } from "../fileTypes/NDispositifFormation";
import { NFormationDiplomeLine } from "../fileTypes/NFormationDiplome";
import { NMefLine } from "../fileTypes/NMef";
import { NNiveauFormationDiplome } from "../fileTypes/NNiveauFormationDiplome";
import { OptionsBTSLine } from "../fileTypes/OptionsBTS";
import { Regroupement } from "../fileTypes/Regroupement";
import { StructureDenseignement } from "../fileTypes/Structures_denseignement";
import { IjRegionData } from "../services/inserJeunesApi/formatRegionData";
import { R } from "../services/inserJeunesApi/formatUaiData";

export type LineTypes = {
  diplomesProfessionnels: DiplomeProfessionnelLine;
  nFormationDiplome_: NFormationDiplomeLine;
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
  ij: R & { uai: string; millesime: string };
  ij_reg: { codeRegion: string; millesime: string } & IjRegionData;
  chomage_regional_INSEE: Chomage_regional_INSEE;
  chomage_departemental_INSEE: Chomage_departemental_INSEE;
  onisep_structures_denseignement_secondaire: StructureDenseignement;
  onisep_structures_denseignement_superieur: StructureDenseignement;
  regroupements: Regroupement;
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
