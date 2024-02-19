import { isAxiosError } from 'axios';
import fs from 'fs'
import { inject } from "injecti";
import { MILLESIMES_IJ } from "shared";

import { R } from "../../../../services/inserJeunesApi/formatUaiData";
import { getUaiData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { cacheIj, clearIjCache } from "./cacheIJ.dep";



export const [fetchIJ] = inject(
  { getUaiData, cacheIj, clearIjCache },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      const d: Array<R> = []
      const millesimesOK: Array<string> = [];
      const millesimesNOK: Array<string> = [];
      console.log(`--- fetch IJ (uai :${uai}})`);
      for (let i = 0; i < MILLESIMES_IJ.length; i++) {
        try {
          const millesime = MILLESIMES_IJ[i];
          const data = await deps.getUaiData({ uai, millesime });
          await deps.clearIjCache({ uai, millesime });
          console.log(`---- fetch IJ OK (uai :${uai}, millesime :${MILLESIMES_IJ[i]})`);
          if (!data) throw new Error("no data");
          millesimesOK.push(MILLESIMES_IJ[i]);
          await deps.cacheIj({ data, uai, millesime });
          d.push(data)
        } catch (err) {
          if (isAxiosError(err)) {
            console.log(`---- fetch IJ NOK (uai :${uai}, millesime :${MILLESIMES_IJ[i]})`, err.code);
          }

          millesimesNOK.push(MILLESIMES_IJ[i]);
        }
      }

      if (d.length > 0) {
        fs.appendFile("./importIJData.txt", `${uai};${d.length};${millesimesOK.join(',')};${millesimesNOK.join(',')}\n`, () => {});
        console.log(`--- fetch IJ summary for ${uai} :`, millesimesOK.join(','), 'ok');
      }
      
      if(millesimesNOK.length > 0) {
        fs.appendFile("./importIJData.txt", `${uai};0;;${MILLESIMES_IJ.join(',')}\n`, () => {});
        console.log(`--- fetch IJ summary for ${uai} :`, millesimesNOK.join(','), 'nok');
      }

      return d
    }
);
