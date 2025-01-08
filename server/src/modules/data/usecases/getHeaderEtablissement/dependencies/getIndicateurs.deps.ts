import { CURRENT_RENTREE } from "shared";
import type { CompareTo, Indicateur, Indicateurs } from "shared/routes/schemas/get.etablissement.uai.header.schema";
import { MILLESIMES_IJ_ETAB } from "shared/time/millesimes";

import { getTauxIJ } from "./getTauxIJ.deps";
import { getValeurAjoutee } from "./getValeurAjoutee.deps";

const getCompareTo = (current?: number, previous?: number, year?: string): CompareTo => {
  if (current === undefined || previous === undefined) {
    return undefined;
  }

  const diff = Math.round(current - previous);

  if (diff > 0) {
    return {
      value: `+${diff}`,
      direction: "up",
      description: `En comparaison avec les millésimes ${year}`,
    };
  }

  if (diff < 0) {
    return {
      value: `${diff}`,
      direction: "down",
      description: `En comparaison avec les millésimes ${year}`,
    };
  }

  return {
    value: `${diff}`,
    direction: "equal",
    description: `En comparaison avec les millésimes ${year}`,
  };
};

const getIndicateur = (current?: number, previous?: number, year?: string): Indicateur => {
  if (current === undefined) {
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
      valeurAjoutee[1]?.millesime?.replace("_", "+"),
    ),
    tauxPoursuite: getIndicateur(
      tauxIJ[0]?.["tauxPoursuite"],
      tauxIJ[1]?.["tauxPoursuite"],
      tauxIJ[1]?.["millesimeSortie"]?.replace("_", "+"),
    ),
    tauxDevenir: getIndicateur(
      tauxIJ[0]?.["tauxDevenir"],
      tauxIJ[1]?.["tauxDevenir"],
      tauxIJ[1]?.["millesimeSortie"]?.replace("_", "+"),
    ),
    tauxEmploi6mois: getIndicateur(
      tauxIJ[0]?.["tauxEmploi6mois"],
      tauxIJ[1]?.["tauxEmploi6mois"],
      tauxIJ[1]?.["millesimeSortie"]?.replace("_", "+"),
    ),
  };
};
