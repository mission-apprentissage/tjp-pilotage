import { inject } from "injecti";
import _ from "lodash";

import { inserJeunesApi } from "../../services/inserJeunesApi/inserJeunes.api";
import { streamIt } from "../../utils/streamIt";
import { getCfdRentrees as getCfdRentreesDep } from "../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "./dependencies.di";

export const [getUais] = inject(
  {
    findFormations: dependencies.findFormations,
    getCfdRentrees: getCfdRentreesDep,
  },
  (deps) => async () => {
    let uais: string[] = [];

    await streamIt(
      async (offset) => deps.findFormations({ offset, limit: 30 }),
      async ({ codeFormationDiplome }) => {
        const cfdRentrees = await deps.getCfdRentrees({
          cfd: codeFormationDiplome,
          year: "2022",
        });
        uais = [
          ...uais,
          ...cfdRentrees.flatMap(({ enseignements }) =>
            enseignements.map(({ uai }) => uai)
          ),
        ];
      }
    );

    return _.uniq(uais);
  }
);

export const [importIJRawData, importIJRawDataFactory] = inject(
  {
    getUais,
    getUaiData: inserJeunesApi.getUaiData,
    cacheIj: dependencies.cacheIj,
    clearIjCache: dependencies.clearIjCache,
  },
  (deps) => async () => {
    await deps.clearIjCache();
    const uais = await deps.getUais();
    let count = 0;
    for (const uai of uais) {
      console.log(count++, uais.length);
      const promises = ["2018_2019", "2019_2020", "2020_2021"].map(
        async (millesime) => {
          const data = await deps.getUaiData({ uai, millesime });
          console.log(uai, millesime, !!data);
          if (!data) return;
          await deps.cacheIj({ data, uai, millesime });
        }
      );
      await Promise.all(promises);
    }
    console.log(uais.length);
  }
);
