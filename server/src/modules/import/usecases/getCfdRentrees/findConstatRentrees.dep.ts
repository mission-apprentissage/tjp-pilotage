import { kdb } from "../../../../db/db";
import { Constat } from "../../fileTypes/Constat";

export const findConstatRentrees = async ({
  mefStat11,
  year,
}: {
  mefStat11: string;
  year: string;
}) => {
  return (
    await kdb
      .selectFrom("rawData")
      .selectAll("rawData")
      .where(
        "type",
        "=",
        `constat_${year}`
      )
      .where("data", "@>", {
        "Mef Bcp 11": mefStat11,
      })
      .execute()
  ).map((item) => item.data as Constat);
};
