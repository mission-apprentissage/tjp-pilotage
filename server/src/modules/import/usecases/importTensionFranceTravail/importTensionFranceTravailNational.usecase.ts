import { AxiosError } from "axios";
import { inject } from "injecti";
import { setTimeout } from "timers/promises";

import { localFilePathManager } from "../../../core/services/filePathManager/localFilePathManager";
import { getStatsPerspectivesRecrutement } from "../../services/franceTravail/franceTravail.api";
import { streamIt } from "../../utils/streamIt";
import {
  appendFranceTravailTensionFile,
  createFranceTravailTensionFile,
  findAllRomeCodes,
} from "./utils";

export const [importTensionFranceTravailNational] = inject(
  {
    findAllRomeCodes,
    createFranceTravailTensionFile,
    filePathManager: localFilePathManager,
    appendFranceTravailTensionFile,
  },
  (deps) => async () => {
    // Create new file
    deps.createFranceTravailTensionFile(
      deps.filePathManager.getFranceTravailIndicateurTensionStatsFilePath()
    );

    // Lister tous les ROMES pour lesquels il faut importer les données de tension
    const romes = (await deps.findAllRomeCodes()).map((r) => r.codeRome);

    console.log(`romes ? ${romes.length}`);

    // Pour chaque ROME, requêter les informations auprès de france travail
    await streamIt(
      (romeCount) => Promise.resolve(romes.slice(romeCount, romeCount + 10)),
      async (codeRome, romeCount) => {
        let retry = true;
        let retryCount = 0;

        do {
          try {
            console.log(`rome ${codeRome} (${romeCount}/${romes.length})`);

            const result = await getStatsPerspectivesRecrutement(codeRome);

            if (result?.length) {
              await deps.appendFranceTravailTensionFile(
                deps.filePathManager.getFranceTravailIndicateurTensionStatsFilePath(),
                result
              );
            }

            retry = false;
          } catch (e) {
            if (e instanceof AxiosError) {
              if (e.response?.status === 429) {
                console.warn(
                  `ERROR [ROME=${codeRome}][Retry ${retryCount}] Too many requests, retrying in 1s`
                );
                await setTimeout(1000);
                retryCount++;
                continue;
              }

              retry = false;
              if (e.response?.data?.message?.includes("FiltreErreurSldng")) {
                console.error(
                  `ERROR [ROME=${codeRome}] ${`Aucun résultat n'a pu être trouvé avec le code : ${codeRome}`}`
                );
              } else {
                console.error(
                  `ERROR [ROME=${codeRome}] ${`Status code : ${e.response?.status}`}`
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
