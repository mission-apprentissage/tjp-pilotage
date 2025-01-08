// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { RENTREES_SCOLAIRES } from "shared";

import { getCfdDispositifs } from "@/modules/import/usecases/getCfdRentrees/getCfdDispositifs.dep";
import { getCfdRentrees } from "@/modules/import/usecases/getCfdRentrees/getCfdRentrees.usecase";
import { streamIt } from "@/modules/import/utils/streamIt";

import { findDiplomesProfessionnels } from "./findDiplomesProfessionnels.dep";
import { findFamillesMetiers } from "./findFamillesMetiers.dep";
import { findFormationsHistoriques } from "./findFormationsHistoriques.dep";
import { findUAIsApprentissage } from "./findUAIsApprentissage.dep";
import { fetchIJ } from "./steps/fetchIJ/fetchIJ.step";
import { fetchIjReg } from "./steps/fetchIjReg/fetchIjReg.step";

const UAI_TO_PROCESS: {
  [k: string]: unknown;
} = {};

function addUaiToProcess(uai: string) {
  if (!UAI_TO_PROCESS[uai]) {
    UAI_TO_PROCESS[uai] = true;
  }
}

const BATCH_SIZE = 50;

export const [importIJData] = inject(
  {
    findFormationsHistoriques,
    findDiplomesProfessionnels,
    findFamillesMetiers,
    fetchIJ,
    fetchIjReg,
  },
  (deps) => {
    return async () => {
      const start = Date.now();
      console.log("--- fetch IJ regions");
      await deps.fetchIjReg();
      console.log("--- end fetch IJ regions");
      console.log("--- recueil des UAI à partir des CFD des diplomes professionnels");
      await streamIt(
        (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
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
        { parallel: 20 },
      );
      console.log("\n--- end recueil des UAI à partir des CFD des diplomes professionnels");

      console.log("--- recueil des UAI à partir des CFD des familles métiers");
      await streamIt(
        (count) => deps.findFamillesMetiers({ offset: count, limit: 60 }),
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
        { parallel: 20 },
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
        await Promise.all(batchs[i].map(async (uai) => await deps.fetchIJ({ uai })));
        console.log(`-- END : batch ${i + 1} / ${batchs.length}`);
      }
      console.log("--- end fetch des données IJ pour les UAIs");
      console.log(Date.now() - start, "ms");
    };
  },
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
  },
);
