import { kdb } from "../../../../db/db";
import { NMefLine } from "../../fileTypes/NMef";

export const findNMef = async ({
  mefstat,
}: {
  mefstat: string;
}): Promise<NMefLine> => {
  return (
    await kdb
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "nMef")
      .where("data", "@>", {
        MEF_STAT_11: mefstat,
      })
      .executeTakeFirst()
  )?.data as NMefLine;
};
