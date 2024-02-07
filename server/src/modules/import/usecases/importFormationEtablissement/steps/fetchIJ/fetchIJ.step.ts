import { inject } from "injecti";

import { getUaiData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { MILLESIMES_IJ } from "../../domain/millesimes";
import { cacheIj, clearIjCache } from "./cacheIJ.dep";

export const [fetchIJ] = inject(
  { getUaiData, cacheIj, clearIjCache },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const promises = MILLESIMES_IJ.map(async (millesime) => {
        const data = await deps.getUaiData({ uai, millesime });
        await deps.clearIjCache({ uai, millesime });
        if (!data) return;
        await deps.cacheIj({ data, uai, millesime });
      });
      await Promise.all(promises);
      console.log(`fetch IJ OK (uai :${uai})`);
    }
);
