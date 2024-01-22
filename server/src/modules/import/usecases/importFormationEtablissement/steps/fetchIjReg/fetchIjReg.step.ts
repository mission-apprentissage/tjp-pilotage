import { inject } from "injecti";

import { kdb } from "../../../../../../db/db";
import { regionAcademiqueMapping } from "../../../../domain/regionAcademiqueMapping";
import { getRegionData } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { MILLESIMES_IJ_REG } from "../../domain/millesimes";
import { cacheIjReg } from "./cacheIjReg.dep";

const clearIjCache = async ({
  codeRegion,
  millesime,
}: {
  codeRegion: string;
  millesime: string;
}) => {
  await kdb
    .deleteFrom("rawData")
    .where("type", "=", "ij_reg")
    .where("data", "@>", { codeRegion, millesime })
    .execute();
};

export const [fetchIjReg] = inject(
  { getRegionData, cacheIjReg },
  (deps) => async () => {
    for (const [codeRegionIj, codeRegion] of Object.entries(
      regionAcademiqueMapping
    )) {
      const promises = MILLESIMES_IJ_REG.map(async (millesime) => {
        const data = await deps.getRegionData({
          codeRegionIj,
          millesime,
        });

        await clearIjCache({ codeRegion, millesime });

        if (!data) return;
        await deps.cacheIjReg({ data, codeRegion, millesime });
      });
      await Promise.all(promises);
      console.log("fetch IJ Reg OK", codeRegionIj);
    }
  }
);
