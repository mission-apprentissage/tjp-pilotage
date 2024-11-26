// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { chain } from "lodash-es";

import { findNMefs } from "./findNMefs.dep";

type AnneesDispositif = Record<string, { mefstat: string; libelleDispositif: string; annee: number }>;

export const [getCfdDispositifs] = inject({ findNMefs }, (deps) => async ({ cfd }: { cfd: string }) => {
  const nMefs = await deps.findNMefs({ cfd });
  const dispositifs = chain(nMefs)
    .orderBy("ANNEE_DISPOSITIF")
    .groupBy("DISPOSITIF_FORMATION")
    .entries()
    .map(([key, nMef]) => ({
      cfd,
      codeDispositif: key,
      dureeDispositif: parseInt(nMef[0].DUREE_DISPOSITIF) ?? undefined,
      anneesDispositif: nMef.reduce<AnneesDispositif>((acc, item) => {
        const annee = parseInt(item.ANNEE_DISPOSITIF) - 1;
        return {
          ...acc,
          [annee]: {
            mefstat: item.MEF_STAT_11,
            libelleDispositif: item.LIBELLE_LONG,
            annee,
          },
        };
      }, {}),
    }))
    .value();
  return dispositifs;
});
