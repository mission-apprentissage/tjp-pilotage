import { getKbdClient } from "@/db/db";

export const cacheIj = async ({ data, uai, millesime }: { data: object; uai: string; millesime: string }) => {
  await getKbdClient()
    .insertInto("rawData")
    .values({ type: "ij", data: JSON.stringify({ ...data, uai, millesime }) })
    .execute();
};

export const clearIjCache = async ({ uai, millesime }: { uai: string; millesime: string }) => {
  await getKbdClient().deleteFrom("rawData").where("type", "=", "ij").where("data", "@>", { uai, millesime }).execute();
};
