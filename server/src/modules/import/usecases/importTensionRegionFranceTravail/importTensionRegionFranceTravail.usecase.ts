import { AxiosError } from "axios";
import { inject } from "injecti";
import { setTimeout } from "timers/promises";

import { localFilePathManager } from "../../../core/services/filePathManager/localFilePathManager";
import { getStatsPerspectivesRecrutementRegion } from "../../services/franceTravail/franceTravail.api";
import { streamIt } from "../../utils/streamIt";
import {
  appendFranceTravailTensionFile,
  createFranceTravailTensionFile,
  findAllRegions,
  findAllRomeCodes,
} from "./importTensionRegionFranceTravail.dep";

export const [importTensionRegionFranceTravail] = inject(
  {
    findAllRomeCodes,
    findAllRegions,
    createFranceTravailTensionFile,
    filePathManager: localFilePathManager,
    appendFranceTravailTensionFile,
  },
  (deps) => async () => {
    // Create new file
    deps.createFranceTravailTensionFile(
      deps.filePathManager.getFranceTravailIndicateurTensionRegionStatsFilePath()
    );

    // Lister tous les ROMES pour lesquels il faut importer les données de tension
    const romes = (await deps.findAllRomeCodes()).map((r) => r.codeRome);

    console.log(`romes ? ${romes.length}`);

    // Lister toutes les régions qui existent
    const regions = (await deps.findAllRegions()).map((d) => d.codeRegion);

    console.log(`regions ? ${regions.length}`);

    // Pour chaque ROME et chaque région, requêter les informations auprès de france travail

    await streamIt(
      (regionCount) =>
        Promise.resolve(regions.slice(regionCount, regionCount + 1)),
      async (codeRegion, regionCount) => {
        await streamIt(
          (romeCount) =>
            Promise.resolve(romes.slice(romeCount, romeCount + 10)),
          async (codeRome, romeCount) => {
            let retry = true;
            let retryCount = 0;

            do {
              try {
                console.log(
                  `Région (${regionCount}/${regions.length}) ${codeRegion} et rome ${codeRome} (${romeCount}/${romes.length})`
                );

                const result = await getStatsPerspectivesRecrutementRegion(
                  codeRome,
                  codeRegion
                );

                if (result?.length) {
                  await deps.appendFranceTravailTensionFile(
                    deps.filePathManager.getFranceTravailIndicateurTensionRegionStatsFilePath(),
                    result
                  );
                }

                retry = false;
              } catch (e) {
                if (e instanceof AxiosError) {
                  if (e.response?.status === 429) {
                    console.warn(
                      `ERROR [REG=${codeRegion},ROME=${codeRome}][Retry ${retryCount}] Too many requests, retrying in 1s`
                    );
                    await setTimeout(1000);
                    retryCount++;
                    continue;
                  }

                  retry = false;
                  if (
                    e.response?.data?.message?.includes("FiltreErreurSldng")
                  ) {
                    console.error(
                      `ERROR [REG=${codeRegion},ROME=${codeRome}] ${`Aucun résultat n'a pu être trouvé avec le code : ${codeRome}`}`
                    );
                  } else {
                    console.error(
                      `ERROR [REG=${codeRegion},ROME=${codeRome}] ${`Status code : ${e.response?.status}`}`
                    );
                  }
                } else {
                  console.error(e);
                  retry = false;
                }
              }
            } while (retry);
          },
          { parallel: 10 }
        );
      }
    );
  }
);
