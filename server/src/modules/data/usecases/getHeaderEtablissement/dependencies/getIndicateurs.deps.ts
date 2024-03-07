import { CURRENT_RENTREE } from "shared";
import { MILLESIMES_IJ_ETAB } from "shared/time/millesimes";

import {
  CompareTo,
  Indicateur,
  Indicateurs,
} from "../getHeaderEtablissement.schema";
import { getTauxIJ } from "./getTauxIJ.deps";
import { getValeurAjoutee } from "./getValeurAjoutee.deps";

const getCompareTo = (
  current?: number,
  previous?: number,
  year?: string
): CompareTo => {
  if (current === undefined || previous === undefined) {
    return undefined;
  }

  const diff = current - previous;

  if (diff > 0) {
    return {
      value: `+${diff.toFixed(2)} vs. ${year}`,
      direction: "up",
      color: "green",
    };
  }

  if (diff < 0) {
    return {
      value: `${diff.toFixed(2)} vs. ${year}`,
      direction: "down",
      color: "red",
    };
  }

  return {
    value: `${diff.toFixed(2)} vs. ${year}`,
    direction: "equal",
    color: "grey",
  };
};

const getIndicateur = (
  current?: number,
  previous?: number,
  year?: string
): Indicateur => {
  if (!current) {
    return undefined;
  }

  const compareTo = getCompareTo(current, previous, year);
  return {
    value: current,
    compareTo,
  };
};

export const getIndicateurs = async ({
  uai,
  rentreeScolaire = CURRENT_RENTREE,
  millesime = MILLESIMES_IJ_ETAB,
}: {
  uai: string;
  rentreeScolaire?: string;
  millesime?: string[];
}): Promise<Indicateurs> => {
  const [tauxIJ, valeurAjoutee] = await Promise.all([
    getTauxIJ({ uai, rentreeScolaire, millesime }),
    getValeurAjoutee({ uai, millesime }),
  ]);

  return {
    millesime: millesime[1].replace("_", "+"),
    valeurAjoutee: getIndicateur(
      valeurAjoutee[0]?.valeurAjoutee,
      valeurAjoutee[1]?.valeurAjoutee,
      valeurAjoutee[1]?.millesime?.replace("_20", "+")
    ),
    tauxPoursuite: getIndicateur(
      tauxIJ[0]?.["tauxPoursuite"],
      tauxIJ[1]?.["tauxPoursuite"],
      tauxIJ[1]?.["millesimeSortie"]?.replace("_20", "+")
    ),
    tauxDevenir: getIndicateur(
      tauxIJ[0]?.["tauxDevenir"],
      tauxIJ[1]?.["tauxDevenir"],
      tauxIJ[1]?.["millesimeSortie"]?.replace("_20", "+")
    ),
    tauxEmploi6mois: getIndicateur(
      tauxIJ[0]?.["tauxEmploi6mois"],
      tauxIJ[1]?.["tauxEmploi6mois"],
      tauxIJ[1]?.["millesimeSortie"]?.replace("_20", "+")
    ),
  };
};
