import { inject } from "injecti";

import { getUaiData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { cacheIj } from "./cacheIj.dep";

export const [fetchIJ] = inject(
  { getUaiData, cacheIj },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const promises = ["2018_2019", "2019_2020", "2020_2021"].map(
        async (millesime) => {
          const data = await deps.getUaiData({ uai, millesime });
          if (!data) return;
          await deps.cacheIj({ data, uai, millesime });
        }
      );
      await Promise.all(promises);
    }
);
