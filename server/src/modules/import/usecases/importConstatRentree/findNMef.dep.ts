import { getKbdClient } from "@/db/db";
import type { NMefLine } from "@/modules/import/fileTypes/NMef";

export const findNMef = async ({ mefstat }: { mefstat: string }): Promise<NMefLine> => {
  return (
    await getKbdClient()
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "nMef")
      .where("data", "@>", {
        MEF_STAT_11: mefstat,
      })
      .executeTakeFirst()
  )?.data as NMefLine;
};
