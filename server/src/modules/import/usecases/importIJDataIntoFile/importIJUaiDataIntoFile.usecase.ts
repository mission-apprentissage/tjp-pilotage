// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import fs from "fs";
import { MILLESIMES_IJ, RENTREES_SCOLAIRES } from "shared";

import { localFilePathManager } from "@/modules/core/services/filePathManager/localFilePathManager";
import { regionAcademiqueMapping } from "@/modules/import/domain/regionAcademiqueMapping";
import { getUaiData } from "@/modules/import/services/inserJeunesApi/inserJeunes.api";
import { getCfdDispositifs } from "@/modules/import/usecases/getCfdRentrees/getCfdDispositifs.dep";
import { getCfdRentrees } from "@/modules/import/usecases/getCfdRentrees/getCfdRentrees.usecase";
import { findFamillesMetiers } from "@/modules/import/usecases/importFormationEtablissement/findFamillesMetiers.dep";
import { findUAIsApprentissage } from "@/modules/import/usecases/importFormationEtablissement/findUAIsApprentissage";
import { findDiplomesProfessionnels } from "@/modules/import/usecases/importIJData/findDiplomesProfessionnels.dep";
import { findFormationsHistoriques } from "@/modules/import/usecases/importIJData/findFormationsHistoriques.dep";
import { fetchIJ } from "@/modules/import/usecases/importIJData/steps/fetchIJ/fetchIJ.step";
import { fetchIjReg } from "@/modules/import/usecases/importIJData/steps/fetchIjReg/fetchIjReg.step";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import { appendIJUaiDataFile, createIJUaiDataFile, loadIdsFromFile } from "./utils";


export const [fetchIjUaiIntoFile] = inject(
  {
    getUaiData,
    createIJUaiDataFile,
    localFilePathManager,
    appendIJUaiDataFile,
  },
  (deps) => async (uai: string, file: fs.WriteStream, existingIds: Set<string>) => {
    let totalAppends = 0;

    for (const [codeRegionIj, codeRegion] of Object.entries(regionAcademiqueMapping)) {

      for (const millesime of MILLESIMES_IJ) {
        try {
          const data = await deps.getUaiData({ uai, millesime });

          const newRows = await deps.appendIJUaiDataFile({
            file,
            data,
            codeRegionIj,
            codeRegion,
            millesime,
            existingIds,
            uai,
          });

          totalAppends += newRows;

          console.log(
            `uai : ${uai} - region : ${codeRegionIj} - Millésime : ${millesime}  ✅ + ${newRows} lignes`
          );

        } catch (_err) {
          console.log(`uai : ${uai} - region : ${codeRegionIj} - Millésime : ${millesime} ❌`);
        }
      }


    }
    console.log(`uai : ${uai} - ${totalAppends} lignes ajoutées`);
  });


const UAI_TO_PROCESS: {
    [k: string]: unknown;
  } = {};

function addUaiToProcess(uai: string) {
  if (!UAI_TO_PROCESS[uai]) {
    UAI_TO_PROCESS[uai] = true;
  }
}

const BATCH_SIZE = 50;

export const [importIJUaiDataIntoFile] = inject(
  {
    findFormationsHistoriques,
    findDiplomesProfessionnels,
    findFamillesMetiers,
    fetchIJ,
    fetchIjReg,
    createIJUaiDataFile,
    localFilePathManager,
    fetchIjUaiIntoFile,
    loadIdsFromFile,
    appendIJUaiDataFile,

  },
  (deps) => {
    return async () => {
      const start = Date.now();

      await deps.createIJUaiDataFile(deps.localFilePathManager.getIJUaiDataFilePath());

      let existingIds = new Set<string>();

      console.log("Chargement des IDs existants");
      existingIds = await loadIdsFromFile(deps.localFilePathManager.getIJUaiDataFilePath());
      console.log(`${existingIds.size} IDs chargés depuis le fichier existant`);

      console.log("Chargement du fichier");
      const file = fs.createWriteStream(deps.localFilePathManager.getIJUaiDataFilePath(), {flags: "a"});

      await streamIt(
        async (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
        async (item) => {
          const cfd = item.cfd;
          const voie = item.voie;
          if (!cfd) return;
          const ancienCfds = await deps.findFormationsHistoriques({ cfd });
          for (const ancienCfd of ancienCfds ?? []) {
            await importIJDataForEtablissement({ cfd: ancienCfd, voie });
          }
          await importIJDataForEtablissement({ cfd, voie });
          process.stdout.write(`\r---- ${Object.keys(UAI_TO_PROCESS).length} processed UAIs`);
        },
        { parallel: 20 }
      );
      console.log("\n--- end recueil des UAI à partir des CFD des diplomes professionnels");

      console.log("--- recueil des UAI à partir des CFD des familles métiers");
      await streamIt(
        async (count) => deps.findFamillesMetiers({ offset: count, limit: 60 }),
        async (item) => {
          const cfd = item.cfd;
          if (!cfd) return;
          const ancienCfds = await deps.findFormationsHistoriques({ cfd });
          for (const ancienCfd of ancienCfds ?? []) {
            await importIJDataForEtablissement({ cfd: ancienCfd });
          }
          await importIJDataForEtablissement({ cfd });

          process.stdout.write(`\r---- ${Object.keys(UAI_TO_PROCESS).length} processed UAIs`);
        },
        { parallel: 20 }
      );
      console.log("\n--- end recueil des UAI à partir des CFD des familles métiers");

      console.log("--- construction batchs");
      const batchs: Array<Array<string>> = [];
      for (const uai in UAI_TO_PROCESS) {
        if (batchs.length === 0) batchs.push([]);
        const lastIndex = batchs.length - 1;
        if (batchs[lastIndex].length < BATCH_SIZE) {
          batchs[lastIndex].push(uai);
        }
        if (batchs[lastIndex].length === BATCH_SIZE) batchs.push([]);
      }
      console.log("--- end constructions batchs");

      console.log("--- fetch des données IJ pour les UAIs");
      for (let i = 0; i < batchs.length; i++) {
        console.log(`-- START : batch ${i + 1} / ${batchs.length}`);
        await Promise.all(batchs[i].map(async (uai) => await deps.fetchIjUaiIntoFile(uai, file, existingIds)));
        console.log(`-- END : batch ${i + 1} / ${batchs.length}`);
      }
      console.log("--- end fetch des données IJ pour les UAIs");
      console.log(Date.now() - start, "ms");
    };
  }
);

export const [importIJDataForEtablissement] = inject(
  {
    findUAIsApprentissage,
    getCfdRentrees,
    getCfdDispositifs,
    fetchIJ,
  },
  (deps) => {
    return async ({ cfd, voie = "scolaire" }: { cfd: string; voie?: string }) => {
      if (voie === "apprentissage") {
        const uais = await deps.findUAIsApprentissage({ cfd });
        if (!uais) return;
        for (const uai of uais) {
          addUaiToProcess(uai);
        }
      }
      const cfdDispositifs = await deps.getCfdDispositifs({ cfd });

      for (const cfdDispositif of cfdDispositifs) {
        const { codeDispositif, anneesDispositif } = cfdDispositif;

        const lastMefstat = Object.values(anneesDispositif).pop()?.mefstat;
        if (!lastMefstat) continue;

        for (const rentreeScolaire of RENTREES_SCOLAIRES) {
          const { enseignements } =
              (await deps.getCfdRentrees({
                cfd,
                codeDispositif,
                year: rentreeScolaire,
              })) ?? {};

          if (!enseignements) continue;

          for (const enseignement of enseignements) {
            const { uai } = enseignement;
            addUaiToProcess(uai);
          }
        }
      }
    };
  }
);
