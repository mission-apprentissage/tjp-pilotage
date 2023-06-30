import { writeFileSync } from "fs";
import { inject } from "injecti";

import { kdb } from "../../../../../../db/db";
import { regionAcademiqueMapping } from "../../../../domain/regionAcademiqueMapping";
import { getRegionData } from "../../../../services/inserJeunesApi/inserJeunes.api";
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
      const promises = ["2019_2020", "2020_2021"].map(async (millesime) => {
        const data = await deps.getRegionData({
          codeRegionIj,
          millesime,
        });

        await clearIjCache({ codeRegion, millesime });

        if (!data) return;
        writeFileSync(
          `ll/${codeRegion}_${millesime}.json`,
          JSON.stringify(data, undefined, "  ")
        );
        await deps.cacheIjReg({ data, codeRegion, millesime });
      });
      await Promise.all(promises);
      console.log("fetch IJ Reg OK", codeRegionIj);
    }
  }
);
