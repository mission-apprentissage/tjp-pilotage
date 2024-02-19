import { inject } from "injecti";
import { RENTREES_SCOLAIRES } from "shared";

import { streamIt } from "../../utils/streamIt";
import { getCfdDispositifs } from "../getCfdRentrees/getCfdDispositifs.dep";
import { getCfdRentrees } from "../getCfdRentrees/getCfdRentrees.usecase";
import { findDiplomesProfessionnels } from "./findDiplomesProfessionnels.dep";
import { findFamillesMetiers } from "./findFamillesMetiers.dep";
import { fetchIJ } from "./steps/fetchIJ/fetchIJ.step";
import { fetchIjReg } from "./steps/fetchIjReg/fetchIjReg.step";
import { importFormationHistorique } from "./steps/importFormationsHistoriques/importFormationsHistoriques.step";

const toProcess: {
  [k: string]: unknown
} = {}

function addProcess(uai: string) {
  if (!toProcess[uai]) {
    toProcess[uai] = true;
  }
}

export const [importIJData] = inject(
  {
    importFormationHistorique,
    findDiplomesProfessionnels,
    findFamillesMetiers,
    fetchIJ,
    fetchIjReg,
  },
  (deps) => {
    return async () => {
      const start = Date.now()
      console.log("--- fetch IJ regions");
      await deps.fetchIjReg();
      console.log("--- end fetch IJ regions");

      console.log("--- recueil des UAI à partir des CFD des diplomes professionnels");
      await streamIt(
        (count) =>
          deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
        async (item) => {
          const cfd = item["Code diplôme"]?.replace("-", "").slice(0, 8);
          if (!cfd) return;
          const ancienCfds = await deps.importFormationHistorique({ cfd });
          for (const ancienCfd of ancienCfds ?? []) {
            await importFormationEtablissements(ancienCfd);
          }
          await importFormationEtablissements(cfd);
          console.log("---- uai count", Object.keys(toProcess).length);
        },
        { parallel: 20 }
      );
      console.log("--- end recueil des UAI à partir des CFD des diplomes professionnels");

      console.log("--- recueil des UAI à partir des CFD des familles métiers");
      await streamIt(
        (count) => deps.findFamillesMetiers({ offset: count, limit: 60 }),
        async (item) => {
          const cfd = item.cfd;
          if (!cfd) return;
          const ancienCfds = await deps.importFormationHistorique({ cfd });
          for (const ancienCfd of ancienCfds ?? []) {
            await importFormationEtablissements(ancienCfd);
          }
          await importFormationEtablissements(cfd);

          console.log("---- uai count", Object.keys(toProcess).length);
        },
        { parallel: 20 }
      );
      console.log("--- end recueil des UAI à partir des CFD des familles métiers");

      console.log("--- construction batchs")
      const batchs: Array<Array<string>> = []
      const BATCH_SIZE = 50;
      for (const uai in toProcess) {
        if (batchs.length === 0) batchs.push([])
        const lastIndex = batchs.length - 1
        if (batchs[lastIndex].length < BATCH_SIZE) {
          batchs[lastIndex].push(uai)
        }
        if (batchs[lastIndex].length === BATCH_SIZE) batchs.push([])
      }
      console.log("--- end constructions batchs")

      console.log("--- fetch des données IJ pour les UAIs")
      for (let i = 0; i < batchs.length; i++) {
        console.log(`-- START : batch ${i + 1} / ${batchs.length}`)
        await Promise.all(batchs[i].map(async (uai) => await deps.fetchIJ({ uai })))
        console.log(`-- END : batch ${i + 1} / ${batchs.length}`)
      }
      console.log("--- end fetch des données IJ pour les UAIs")
      console.log(Date.now() - start, "ms")
    };
  }
);

export const [importFormationEtablissements] = inject(
  {
    getCfdRentrees,
    getCfdDispositifs,
    fetchIJ,
  },
  (deps) => {
    return async (
      cfd: string
    ) => {
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
            const { uai, voie } = enseignement;
            addProcess(uai);
            if (voie !== "scolaire") continue;
          }
        }
      }
    };
  }
);
