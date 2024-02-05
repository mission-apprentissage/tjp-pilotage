import { inject } from "injecti";
import { RENTREES_SCOLAIRES } from "shared";

import { streamIt } from "../../utils/streamIt";
import { getCfdDispositifs } from "../getCfdRentrees/getCfdDispositifs.dep";
import { getCfdRentrees } from "../getCfdRentrees/getCfdRentrees.usecase";
import { findDiplomesProfessionnels } from "../importFormationEtablissement/findDiplomesProfessionnels.dep";
import { findFamillesMetiers } from "../importFormationEtablissement/findFamillesMetiers.dep";
import { findUAIsApprentissage } from "../importFormationEtablissement/findUAIsApprentissage";
import { getAllDataEtablissements } from "./getAllDataEtablissements.dep";
import {
  createDonneesIJReg,
  createDonneesIJRegFile,
} from "./steps/createCSVDonneesIJReg/createCSVDonneesIJReg.step";
import {
  createDonneesIJ,
  createDonneesIJFile,
} from "./steps/createDonneesIJ/createDonneesIJ.step";

export const [importDonneesIJCfd] = inject(
  {
    findUAIsApprentissage,
    getCfdDispositifs,
    getCfdRentrees,
    createDonneesIJ,
    createDonneesIJReg,
  },
  (deps) =>
    async ({ cfd, voie = "scolaire" }: { cfd: string; voie?: string }) => {
      if (voie !== "scolaire") {
        const uais = await deps.findUAIsApprentissage({ cfd });
        if (!uais) return;

        for (const uai of uais) {
          deps.createDonneesIJ({ uai });
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
            deps.createDonneesIJ({ uai: enseignement.uai });
          }
        }
      }
    }
);

export const [importDonneesIJ] = inject(
  {
    createDonneesIJFile,
    createDonneesIJ,
    getAllDataEtablissements,
    findDiplomesProfessionnels,
    findFamillesMetiers,
    importDonneesIJCfd,
    createDonneesIJReg,
    createDonneesIJRegFile,
  },
  (deps) => async (reset: boolean | string) => {
    if (reset) {
      deps.createDonneesIJFile();
      deps.createDonneesIJRegFile();
    }
    deps.createDonneesIJReg();

    await streamIt(
      (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
      async (item, count) => {
        const cfd = item.cfd;
        const voie = item.voie;
        console.log("cfd", cfd, count);
        await importDonneesIJCfd({ cfd, voie });
      },
      {
        parallel: 20,
      }
    );

    await streamIt(
      (count) => deps.findFamillesMetiers({ offset: count, limit: 60 }),
      async (item, count) => {
        const cfd = item.cfd;
        console.log("cfd famille", cfd, count);
        if (!cfd) return;
        await importDonneesIJCfd({ cfd });
      },
      {
        parallel: 20,
      }
    );
  }
);
