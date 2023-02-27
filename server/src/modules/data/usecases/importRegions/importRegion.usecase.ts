import { dataDI } from "../../data.DI";
import { streamIt } from "../../utils/streamIt";
import { importRegionsDeps } from "./importRegions.deps";

export const importRegionsFactory =
  ({
    createRegions = importRegionsDeps.createRegions,
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
  }) =>
  async () => {
    console.log(`Import des regions`);

    let count = 0;
    await streamIt(
      (count) => findRawDatas({ type: "regions", offset: count, limit: 20 }),
      async (item) => {
        const region = {
          id: item.codeRegion,
          libelleRegion: item.libelleRegion,
        };

        count++;
        process.stdout.write(`\r${count}`);
        await createRegions([region]);
      }
    );

    process.stdout.write(`\r${count} régions ajoutées ou mises à jour\n`);
  };

export const importRegions = importRegionsFactory({});
