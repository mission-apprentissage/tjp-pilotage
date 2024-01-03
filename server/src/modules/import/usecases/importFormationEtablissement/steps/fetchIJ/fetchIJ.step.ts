import { inject } from "injecti";

import { kdb } from "../../../../../../db/db";
import { MILLESIMES_IJ } from "../../domain/millesimes";
import { getUaiData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { cacheIj } from "./cacheIJ.dep";

const clearIjCache = async ({ uai }: { uai: string }) => {
  await kdb
    .deleteFrom("rawData")
    .where("type", "=", "ij")
    .where("data", "@>", { uai })
    .execute();
};

export const [fetchIJ] = inject(
  { getUaiData, cacheIj },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const promises = MILLESIMES_IJ.map(async (millesime) => {
        const data = await deps.getUaiData({ uai, millesime });
        await clearIjCache({ uai });
        if (!data) return;
        await deps.cacheIj({ data, uai, millesime });
      });
      await Promise.all(promises);
      console.log("fetch IJ OK", uai);
    }
);
