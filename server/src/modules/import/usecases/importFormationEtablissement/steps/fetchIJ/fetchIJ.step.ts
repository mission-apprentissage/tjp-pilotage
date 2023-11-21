import { inject } from "injecti";

import { kdb } from "../../../../../../db/db";
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
      const promises = ["2018_2019", "2019_2020", "2020_2021"].map(
        async (millesime) => {
          const data = await deps.getUaiData({ uai, millesime });
          await clearIjCache({ uai });
          if (!data) return;
          await deps.cacheIj({ data, uai, millesime });
        }
      );
      await Promise.all(promises);
      console.log("fetch IJ OK", uai);
    }
);
