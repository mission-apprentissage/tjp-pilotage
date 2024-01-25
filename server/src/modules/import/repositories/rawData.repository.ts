import { kdb } from "../../../db/db";
import { Attractivite_capacite } from "../fileTypes/Attractivite_capacite";
import { Attractivite_capacite_BTS } from "../fileTypes/Attractivite_capacite_BTS";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../fileTypes/Cab-nbre_division_effectifs_par_etab_mefst11";
import { Decrochage_academique } from "../fileTypes/Decrochage_academique";
import { Decrochage_regional } from "../fileTypes/Decrochage_regional";
import { Departements_academies_regions } from "../fileTypes/Departements_academies_regions";
import { DiplomeProfessionnelLine } from "../fileTypes/DiplomesProfessionnels";
import { FamillesMetiersLine } from "../fileTypes/FamilleMetiers";
import { LyceesACCELine } from "../fileTypes/LyceesACCELine";
import { NDispositifFormation } from "../fileTypes/NDispositifFormation";
import { NFormationDiplomeLine } from "../fileTypes/NFormationDiplome";
import { NMefLine } from "../fileTypes/NMef";
import { NNiveauFormationDiplome } from "../fileTypes/NNiveauFormationDiplome";
import { OptionsBTSLine } from "../fileTypes/OptionsBTS";
import { IjRegionData } from "../services/inserJeunesApi/formatRegionData";
import { R } from "../services/inserJeunesApi/formatUaiData";

type LineTypes = {
  diplomesProfessionnels: DiplomeProfessionnelLine;
  nFormationDiplome_: NFormationDiplomeLine;
  familleMetiers: FamillesMetiersLine;
  optionsBTS: OptionsBTSLine;
  lyceesACCE: LyceesACCELine;
  nMef: NMefLine;
  "Cab-nbre_division_effectifs_par_etab_mefst11": Cab_bre_division_effectifs_par_etab_mefst11;
  departements_academies_regions: Departements_academies_regions;
  nNiveauFormationDiplome_: NNiveauFormationDiplome;
  nDispositifFormation_: NDispositifFormation;
  attractivite_capacite: Attractivite_capacite;
  attractivite_capacite_BTS: Attractivite_capacite_BTS;
  ij: R & { uai: string; millesime: string };
  ij_reg: { codeRegion: string; millesime: string } & IjRegionData;
  decrochage_regional: Decrochage_regional;
  decrochage_academique: Decrochage_academique;
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
