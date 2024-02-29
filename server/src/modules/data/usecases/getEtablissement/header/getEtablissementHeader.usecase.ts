import { inject } from "injecti";

import {
  getFilieres,
  getInformations,
  getTauxIJ,
  getValeurAjoutee,
} from "./dependencies";
import { GetEtablissementHeaderType } from "./getEtablissementHeader.schema";

export const [getEtablissementHeader] = inject(
  { getInformations, getValeurAjoutee, getTauxIJ, getFilieres },
  (deps) =>
    async ({ uai }: { uai: string }): Promise<GetEtablissementHeaderType> => {
      const [informations, filieres] = await Promise.all([
        deps.getInformations({ uai }),
        deps.getFilieres({ uai }),
      ]);

      return {
        informations,
        filieres,
        indicateurs: {
          millesime: "2021+2022",
          valeurAjoutee: {
            value: 3,
            compareTo: {
              value: "+0.2 vs. 2020+21",
              direction: "up",
              color: "green",
            },
          },
          tauxPoursuite: {
            value: 0.63,
            compareTo: {
              value: "+0.1 vs. 2020+21",
              direction: "up",
              color: "green",
            },
          },
          tauxDevenir: {
            value: 0.73,
            compareTo: {
              value: "+0.1 vs. 2020+21",
              direction: "up",
              color: "green",
            },
          },
          tauxEmploi6mois: {
            value: 0.73,
            compareTo: {
              value: "+0.1 vs. 2020+21",
              direction: "down",
              color: "red",
            },
          },
        },
      };
    }
);
