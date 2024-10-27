import { getKbdClient } from "@/db/db";
import type { JsonObject } from "@/db/schema";

export const findRegroupements = async ({ mefstats }: { mefstats: string[] }) => {
  const data = (
    await getKbdClient()
      .selectFrom("rawData")
      .select("data")
      .where("type", "=", "regroupements")
      .where((eb) => {
        return eb.or(mefstats.map((mefstat) => eb("data", "@>", { MEF_STAT_11: mefstat })));
      })
      .executeTakeFirst()
  )?.data;
  if (!data) return;
  return (data as JsonObject)?.["REGROUPEMENT A2-2"] as string;
};
