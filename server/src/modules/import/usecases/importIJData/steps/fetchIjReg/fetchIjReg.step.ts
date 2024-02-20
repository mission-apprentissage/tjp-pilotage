import { inject } from "injecti";
import { MILLESIMES_IJ_REG } from "shared";

import { regionAcademiqueMapping } from "../../../../domain/regionAcademiqueMapping";
import { getRegionData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { cacheIjReg, clearIjRegCache } from "./cacheIjReg.dep";


export const [fetchIjReg] = inject(
  { getRegionData, cacheIjReg, clearIjRegCache },
  (deps) => async () => {
    for (const [codeRegionIj, codeRegion] of Object.entries(
      regionAcademiqueMapping
    )) {
      const promises = MILLESIMES_IJ_REG.map(async (millesime) => {
        const data = await deps.getRegionData({
          codeRegionIj,
          millesime,
        });

        await deps.clearIjRegCache({ codeRegion, millesime });

        if (!data) return;
        await deps.cacheIjReg({ data, codeRegion, millesime });
      });
      await Promise.all(promises);
      console.log("fetch IJ Reg OK", codeRegionIj);
    }
  }
);
