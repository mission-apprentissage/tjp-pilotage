import _ from "lodash";

import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { NMefLine } from "../../files/NMef";
import { inserJeunesApi } from "../../services/inserJeunesApi/inserJeunes.api";
import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./dependencies.di";

const toCfdMefs = ({
  nMefs,
  isSpecialite,
}: {
  nMefs: NMefLine[];
  isSpecialite: boolean;
}) => {
  return nMefs
    .filter(
      (item) => parseInt(item.ANNEE_DISPOSITIF) === (isSpecialite ? 2 : 1)
    )
    .map((nMefDebut) => nMefDebut.MEF_STAT_11);
};

const toUais = ({
  constatRentrees,
}: {
  constatRentrees: Cab_bre_division_effectifs_par_etab_mefst11[];
}) => {
  return constatRentrees.map(
    (constatRentree) => constatRentree["Numéro d'établissement"]
  );
};

export const getUaisFactory =
  ({
    findNMefs = dependencies.findNMefs,
    findContratRentrees = dependencies.findContratRentrees,
    findFamilleMetier = dependencies.findFamilleMetier,
    findFormations = dependencies.findFormations,
  }) =>
  async () => {
    let uais: string[] = [];

    await streamIt(
      async (offset) => findFormations({ offset, limit: 30 }),
      async ({ codeFormationDiplome }) => {
        const isSpecialite = !!(await findFamilleMetier({
          cfdSpecialite: codeFormationDiplome,
        }));
        const nMefs = await findNMefs({ cfd: codeFormationDiplome });
        const cfdMefs = toCfdMefs({ nMefs, isSpecialite });

        for (const cfdMef of cfdMefs) {
          const constatRentrees = await findContratRentrees({
            mefStat11: cfdMef,
          });

          const uaiFormations = toUais({ constatRentrees });
          uais = [...uais, ...uaiFormations];
        }
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
      console.log(count++);
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
