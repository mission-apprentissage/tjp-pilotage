import { inject } from "injecti";
import { MILLESIMES_IJ_REG } from "shared";

import { regionAcademiqueMapping } from "../../../../domain/regionAcademiqueMapping";
import { IjRegionData } from "../../../../services/inserJeunesApi/formatRegionData";
import { getRegionData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { cacheIjReg, clearIjRegCache } from "./cacheIjReg.dep";

export const [fetchIjReg] = inject(
  { getRegionData, cacheIjReg, clearIjRegCache },
  (deps) => async () => {
    for (const [codeRegionIj, codeRegion] of Object.entries(
      regionAcademiqueMapping
    )) {
      const d: Array<IjRegionData> = [];
      const millesimesOK: Array<string> = [];
      const millesimesNOK: Array<string> = [];
      for (const millesime of MILLESIMES_IJ_REG) {
        try {
          const data = await deps.getRegionData({ codeRegionIj, millesime });
          await deps.clearIjRegCache({ codeRegion, millesime });
          if (!data) throw new Error("no data");
          millesimesOK.push(millesime);
          await deps.cacheIjReg({ data, codeRegion, millesime });
          d.push(data);
        } catch (err) {
          millesimesNOK.push(millesime);
        }
      }

      if (d.length > 0) {
        console.log(
          `--- fetch IJ Reg summary for ${codeRegion} (code region IJ : ${codeRegionIj}) :`,
          millesimesOK.join(","),
          "ok"
        );
      }

      if (millesimesNOK.length > 0) {
        console.log(
          `--- fetch IJ Reg summary for ${codeRegion} (code region IJ : ${codeRegionIj}) :`,
          millesimesNOK.join(","),
          "nok"
        );
      }
    }
  }
);
