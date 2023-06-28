import { kdb } from "../../../db/db";
import { Attractivite_capacite } from "../files/Attractivite_capacite";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { Departements_academies_regions } from "../files/Departements_academies_regions";
import { DiplomeProfessionnelLine } from "../files/DiplomesProfessionnels";
import { FamillesMetiersLine } from "../files/FamilleMetiers";
import { LyceesACCELine } from "../files/LyceesACCELine";
import { NDispositifFormation } from "../files/NDispositifFormation";
import { NFormationDiplomeLine } from "../files/NFormationDiplome";
import { NMefLine } from "../files/NMef";
import { NNiveauFormationDiplome } from "../files/NNiveauFormationDiplome";
import { R } from "../services/inserJeunesApi/formatUaiData";

type LineTypes = {
  diplomesProfessionnels: DiplomeProfessionnelLine;
  nFormationDiplome_: NFormationDiplomeLine;
  familleMetiers: FamillesMetiersLine;
  lyceesACCE: LyceesACCELine;
  nMef: NMefLine;
  "Cab-nbre_division_effectifs_par_etab_mefst11": Cab_bre_division_effectifs_par_etab_mefst11;
  departements_academies_regions: Departements_academies_regions;
  nNiveauFormationDiplome_: NNiveauFormationDiplome;
  nDispositifFormation_: NDispositifFormation;
  attractivite_capacite: Attractivite_capacite;
  ij: R & { uai: string; millesime: string };
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
