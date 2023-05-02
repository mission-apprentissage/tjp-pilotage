import _ from "lodash";

import { inserJeunesApi } from "../../services/inserJeunesApi/inserJeunes.api";
import { streamIt } from "../../utils/streamIt";
import { getCfdRentrees as getCfdRentreesDep } from "../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "./dependencies.di";

export const getUaisFactory =
  ({
    findFormations = dependencies.findFormations,
    getCfdRentrees = getCfdRentreesDep,
  }) =>
  async () => {
    let uais: string[] = [];

    await streamIt(
      async (offset) => findFormations({ offset, limit: 30 }),
      async ({ codeFormationDiplome }) => {
        const daaa = await getCfdRentrees({ cfd: codeFormationDiplome });
        uais = [...uais, ...daaa.map((item) => item.uai)];
      }
    );

    return _.uniq(uais);
  };

export const importIJRawDataFactory =
  ({
    getUais = getUaisFactory({}),
    getUaiData = inserJeunesApi.getUaiData,
    cacheIj = dependencies.cacheIj,
    clearIjCache = dependencies.clearIjCache,
  }) =>
  async () => {
    await clearIjCache();
    const uais = await getUais();
    let count = 0;
    for (const uai of uais) {
      console.log(count++, uais.length);
      const promises = ["2018_2019", "2019_2020", "2020_2021"].map(
        async (millesime) => {
          const data = await getUaiData({ uai, millesime });
          console.log(uai, millesime, !!data);
          if (!data) return;
          await cacheIj({ data, uai, millesime });
        }
      );
      await Promise.all(promises);
    }
    console.log(uais.length);
  };

export const importIJRawData = importIJRawDataFactory({});
