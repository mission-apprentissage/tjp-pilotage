import { db, pool } from "../../../db/zapatos";
import { Affelnet2ndeLine } from "../files/Affelnet2ndeLine";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { Departements_academies_regions } from "../files/Departements_academies_regions";
import { DiplomeProfessionnelLine } from "../files/DiplomesProfessionnels";
import { FamillesMetiersLine } from "../files/FamilleMetiers";
import { LyceesACCELine } from "../files/LyceesACCELine";
import { NDispositifFormation } from "../files/NDispositifFormation";
import { NFormationDiplomeLine } from "../files/NFormationDiplome";
import { NMefLine } from "../files/NMef";
import { NNiveauFormationDiplome } from "../files/NNiveauFormationDiplome";

type LineTypes = {
  diplomesProfessionnels: DiplomeProfessionnelLine;
  nFormationDiplome_: NFormationDiplomeLine;
  familleMetiers: FamillesMetiersLine;
  affelnet2nde: Affelnet2ndeLine;
  lyceesACCE: LyceesACCELine;
  nMef: NMefLine;
  "Cab-nbre_division_effectifs_par_etab_mefst11": Cab_bre_division_effectifs_par_etab_mefst11;
  departements_academies_regions: Departements_academies_regions;
  nNiveauFormationDiplome_: NNiveauFormationDiplome;
  nDispositifFormation_: NDispositifFormation;
};

const findRawData = async <T extends keyof LineTypes>({
  type,
  filter,
}: {
  type: T;
  filter?: Partial<LineTypes[T]>;
}) => {
  const item = await db
    .selectOne("rawData", {
      ...(filter
        ? {
            data: db.sql`${db.self}@>${db.param(filter)}`,
          }
        : undefined),
      type,
    })
    .run(pool);
  return (item?.data as LineTypes[T]) ?? undefined;
};

const findRawDatas = async <T extends keyof LineTypes>({
  type,
  offset = 0,
  limit,
}: {
  type: T;
  offset?: number;
  limit?: number;
}) => {
  const items = await db
    .select(
      "rawData",
      { type },
      { offset, limit, order: { by: "data", direction: "ASC" } }
    )
    .run(pool);
  return items.map((item) => item.data as LineTypes[T]);
};

export const rawDataRepository = { findRawData, findRawDatas };
