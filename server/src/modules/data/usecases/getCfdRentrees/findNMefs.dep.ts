import { kdb } from "../../../../db/db";
import { NMefLine } from "../../fileTypes/NMef";

export const findNMefs = async ({ cfd }: { cfd: string }) =>
  (
    await kdb
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "nMef")
      .where("data", "@>", {
        FORMATION_DIPLOME: cfd,
      })
      .execute()
  ).map((item) => item.data as NMefLine);
