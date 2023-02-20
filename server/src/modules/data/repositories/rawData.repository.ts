import { db, pool } from "../../../db/zapatos";
import { Affelnet2ndeLine } from "../files/Affelnet2ndeLine";
import { DiplomeProfessionnelLine } from "../files/DiplomesProfessionnels";
import { FamillesMetiersLine } from "../files/FamilleMetiers";
import { LyceesACCELine } from "../files/LyceesACCELine";
import { NFormationDiplomeLine } from "../files/NFormationDiplome";
import { RegionLine } from "../files/Region";

type LineTypes = {
  diplomesProfessionnels: DiplomeProfessionnelLine;
  nFormationDiplome_: NFormationDiplomeLine;
  familleMetiers: FamillesMetiersLine;
  affelnet2nde: Affelnet2ndeLine;
  lyceesACCE: LyceesACCELine;
  regions: RegionLine;
};

const findRawData = async <T extends keyof LineTypes>({
  key,
  type,
}: {
  key?: string;
  type: T;
}) => {
  const item = await db
    .selectOne("rawData", { ...(key ? { key } : undefined), type })
    .run(pool);
  return (item?.data as LineTypes[T]) ?? undefined;
};

const findRawDatas = async <T extends keyof LineTypes>({
  key,
  type,
  offset = 0,
  limit,
}: {
  key?: string;
  type: T;
  offset?: number;
  limit?: number;
}) => {
  const items = await db
    .select(
      "rawData",
      { ...(key ? { key } : undefined), type },
      { offset, limit }
    )
    .run(pool);
  return items.map((item) => item.data as LineTypes[T]);
};

export const rawDataRepository = { findRawData, findRawDatas };
