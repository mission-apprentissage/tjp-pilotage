// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { MILLESIMES_IJ_REG } from "shared";

import { regionAcademiqueMapping } from "@/modules/import/domain/regionAcademiqueMapping";
import type { IjRegionData } from "@/modules/import/services/inserJeunesApi/formatRegionData";
import { getRegionData } from "@/modules/import/services/inserJeunesApi/inserJeunes.api";

import { cacheIjReg, clearIjRegCache } from "./cacheIjReg.dep";

export const [fetchIjReg] = inject({ getRegionData, cacheIjReg, clearIjRegCache }, (deps) => async () => {
  for (const [codeRegionIj, codeRegion] of Object.entries(regionAcademiqueMapping)) {
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
        // eslint-disable-next-line unused-imports/no-unused-vars
      } catch (_err) {
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
});
