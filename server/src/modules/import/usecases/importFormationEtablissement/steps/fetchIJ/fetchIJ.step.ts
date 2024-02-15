import { inject } from "injecti";
import { MILLESIMES_IJ } from "shared";

import { getUaiData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { cacheIj, clearIjCache } from "./cacheIJ.dep";

export const [fetchIJ] = inject(
  { getUaiData, cacheIj, clearIjCache },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      for (const millesime of MILLESIMES_IJ) {
        const data = await deps.getUaiData({ uai, millesime });
        await deps.clearIjCache({ uai, millesime });
        if (!data) continue;
        await deps.cacheIj({ data, uai, millesime });
      }
    }
);
