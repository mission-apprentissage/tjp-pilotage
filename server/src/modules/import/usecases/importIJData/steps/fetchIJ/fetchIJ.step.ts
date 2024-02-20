import { inject } from "injecti";
import { MILLESIMES_IJ } from "shared";

import { R } from "../../../../services/inserJeunesApi/formatUaiData";
import { getUaiData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { cacheIj, clearIjCache } from "./cacheIJ.dep";

export const [fetchIJ] = inject(
  { getUaiData, cacheIj, clearIjCache },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const d: Array<R> = [];
      const millesimesOK: Array<string> = [];
      const millesimesNOK: Array<string> = [];
      console.log(`--- fetch IJ (uai :${uai}})`);
      for (let i = 0; i < MILLESIMES_IJ.length; i++) {
        try {
          const millesime = MILLESIMES_IJ[i];
          const data = await deps.getUaiData({ uai, millesime });
          await deps.clearIjCache({ uai, millesime });
          if (!data) throw new Error("no data");
          millesimesOK.push(MILLESIMES_IJ[i]);
          await deps.cacheIj({ data, uai, millesime });
          d.push(data);
        } catch (err) {
          millesimesNOK.push(MILLESIMES_IJ[i]);
        }
      }

      if (d.length > 0) {
        console.log(
          `--- fetch IJ summary for ${uai} :`,
          millesimesOK.join(","),
          "ok"
        );
      }

      if (millesimesNOK.length > 0) {
        console.log(
          `--- fetch IJ summary for ${uai} :`,
          millesimesNOK.join(","),
          "nok"
        );
      }

      return d;
    }
);
