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
