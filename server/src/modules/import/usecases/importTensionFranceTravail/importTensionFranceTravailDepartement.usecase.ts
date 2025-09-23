import { AxiosError } from "axios";
import { setTimeout } from "timers/promises";

import { localFilePathManager } from "@/modules/core/services/filePathManager/localFilePathManager";
import { getStatsPerspectivesRecrutementDepartement } from "@/modules/import/services/franceTravail/franceTravail.api";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import {
  appendFranceTravailTensionFile,
  createFranceTravailTensionFile,
  findAllDepartements,
  findAllRomeCodes,
} from "./utils";

export const [importTensionFranceTravailDepartement] = inject(
  {
    findAllRomeCodes,
    findAllDepartements,
    createFranceTravailTensionFile,
    filePathManager: localFilePathManager,
    appendFranceTravailTensionFile,
  },
  (deps) => async () => {
    // Create new file
    await deps.createFranceTravailTensionFile(
      deps.filePathManager.getFranceTravailIndicateurTensionDepartementStatsFilePath()
    );

    // Lister tous les ROMES pour lesquels il faut importer les données de tension
    const romes = (await deps.findAllRomeCodes()).map((r) => r.codeRome);

    console.log(`romes ? ${romes.length}`);

    // Lister tous les départements qu'il existe
    const departements = (await deps.findAllDepartements()).map((d) => d.codeDepartement);

    console.log(`départements ? ${departements.length}`);

    // Pour chaque ROME et chaque département, requêter les informations auprès de france travail

    await streamIt(
      async (departementCount) => Promise.resolve(departements.slice(departementCount, departementCount + 1)),
      async (codeDepartement, departementCount) => {
        await streamIt(
          async (romeCount) => Promise.resolve(romes.slice(romeCount, romeCount + 10)),
          async (codeRome, romeCount) => {
            let retry = true;
            let retryCount = 0;

            do {
              try {
                console.log(
                  `Département (${departementCount}/${departements.length}) ${codeDepartement} et rome ${codeRome} (${romeCount}/${romes.length})`
                );

                const result = await getStatsPerspectivesRecrutementDepartement(codeRome, codeDepartement);

                if (result?.length) {
                  await deps.appendFranceTravailTensionFile(
                    deps.filePathManager.getFranceTravailIndicateurTensionDepartementStatsFilePath(),
                    result
                  );
                }

                retry = false;
              } catch (e) {
                if (e instanceof AxiosError) {
                  if (e.response?.status === 429) {
                    console.warn(
                      `ERROR [DEP=${codeDepartement},ROME=${codeRome}][Retry ${retryCount}] Too many requests, retrying in 1s`
                    );
                    await setTimeout(1000);
                    retryCount++;
                    continue;
                  }

                  retry = false;
                  if (e.response?.data?.message?.includes("FiltreErreurSldng")) {
                    console.error(
                      `ERROR [DEP=${codeDepartement},ROME=${codeRome}] Aucun résultat n'a pu être trouvé avec le code : ${codeRome}`
                    );
                  } else {
                    console.error(
                      `ERROR [DEP=${codeDepartement},ROME=${codeRome}] Status code : ${e.response?.status}`
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
