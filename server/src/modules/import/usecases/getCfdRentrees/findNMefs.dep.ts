import { getKbdClient } from "@/db/db";
import type { NMefLine } from "@/modules/import/fileTypes/NMef";

export const findNMefs = async ({ cfd }: { cfd: string }) =>
  (
    await getKbdClient()
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "nMef")
      .where("data", "@>", {
        FORMATION_DIPLOME: cfd,
      })
      .execute()
  ).map((item) => item.data as NMefLine);
