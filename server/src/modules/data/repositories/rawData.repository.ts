import { db, pool } from "../../../db/zapatos";
import { Affelnet2ndeLine } from "../files/Affelnet2ndeLine";
import { DiplomeProfessionnelLine } from "../files/DiplomesProfessionnels";
import { FamillesMetiersLine } from "../files/FamilleMetiers";
import { LyceesACCELine } from "../files/LyceesACCELine";
import { NFormationDiplomeLine } from "../files/NFormationDiplome";
import { NMefLine } from "../files/NMef";
import { RegionLine } from "../files/Region";

type LineTypes = {
  diplomesProfessionnels: DiplomeProfessionnelLine;
  nFormationDiplome_: NFormationDiplomeLine;
  familleMetiers: FamillesMetiersLine;
  affelnet2nde: Affelnet2ndeLine;
  lyceesACCE: LyceesACCELine;
  regions: RegionLine;
  nMef: NMefLine;
};

const findRawData = async <T extends keyof LineTypes>({
  type,
  filter,
}: {
  type: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
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
    .select("rawData", { type }, { offset, limit })
    .run(pool);
  return items.map((item) => item.data as LineTypes[T]);
};

export const rawDataRepository = { findRawData, findRawDatas };
