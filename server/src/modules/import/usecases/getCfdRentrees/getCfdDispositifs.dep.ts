import { inject } from "injecti";
import _ from "lodash";

import { findNMefs } from "./findNMefs.dep";

export const [getCfdDispositifs] = inject(
  { findNMefs },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      const nMefs = await deps.findNMefs({ cfd });
      const dispositifs = _.chain(nMefs)
        .orderBy("ANNEE_DISPOSITIF")
        .groupBy("DISPOSITIF_FORMATION")
        .entries()
        .map(([key, nMef]) => ({
          cfd,
          dispositifId: key,
          dureeDispositif: parseInt(nMef[0].DUREE_DISPOSITIF) ?? undefined,
          anneesDispositif: nMef.reduce(
            (acc, item) => {
              const annee = parseInt(item.ANNEE_DISPOSITIF) - 1;
              return {
                ...acc,
                [annee]: {
                  mefstat: item.MEF_STAT_11,
                  libelleDispositif: item.LIBELLE_LONG,
                  annee,
                },
              };
            },
            {} as Record<
              string,
              { mefstat: string; libelleDispositif: string; annee: number }
            >
          ),
        }))
        .value();
      return dispositifs;
    }
);
