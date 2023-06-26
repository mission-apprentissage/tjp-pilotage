import { kdb } from "../../../../../../db/db";

export const cacheIj = async ({
  data,
  uai,
  millesime,
}: {
  data: object;
  uai: string;
  millesime: string;
}) => {
  await kdb
    .insertInto("rawData")
    .values({ type: "ij", data: JSON.stringify({ ...data, uai, millesime }) })
    .execute();
};
