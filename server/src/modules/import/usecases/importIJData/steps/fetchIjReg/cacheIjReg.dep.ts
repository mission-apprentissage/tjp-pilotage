import { kdb } from "../../../../../../db/db";

export const cacheIjReg = async ({
  data,
  codeRegion,
  millesime,
}: {
  data: object;
  codeRegion: string;
  millesime: string;
}) => {
  await kdb
    .insertInto("rawData")
    .values({
      type: "ij_reg",
      data: JSON.stringify({ ...data, codeRegion, millesime }),
    })
    .execute();
};

export const clearIjRegCache = async ({
  codeRegion,
  millesime,
}: {
  codeRegion: string;
  millesime: string;
}) => {
  await kdb
    .deleteFrom("rawData")
    .where("type", "=", "ij_reg")
    .where("data", "@>", { codeRegion, millesime })
    .execute();
};
