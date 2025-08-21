import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from 'shared';
import { getMillesime } from 'shared/utils/getMillesime';

import { formatMillesime } from '@/utils/formatLibelle';
import { formatNumber } from '@/utils/formatUtils';

export const getEvolutionEffectifKeys = () => {
  return [
    "Effectif 1",
    "Effectif 2",
    "Effectif 3"
  ];
};

export const getEvolutionEffectifData = ({
  effectif1,
  effectif2,
  effectif3,
}: {
  effectif1?: number;
  effectif2?: number;
  effectif3?: number;
}) => {
  return {
    "Effectif 1": effectif1,
    "Effectif 2": effectif2,
    "Effectif 3": effectif3,
  };
};

export const getEvolutionTauxSortieKeys = () => {
  return [
    formatMillesime(getMillesime({millesimeSortie: CURRENT_IJ_MILLESIME, offset: -2})),
    formatMillesime(getMillesime({millesimeSortie: CURRENT_IJ_MILLESIME, offset: -1})),
    formatMillesime(getMillesime({millesimeSortie: CURRENT_IJ_MILLESIME, offset: 0})),
  ];
};

export const getEvolutionTauxSortieData = ({
  taux,
  evolutions
}: {
  taux: "tauxInsertion" | "tauxPoursuite" | "tauxDevenirFavorable";
  evolutions?: Array<{
    millesimeSortie: string;
    tauxInsertion?: number;
    tauxPoursuite?: number;
    tauxDevenirFavorable?: number;
  }>
}) => {
  if (!evolutions) return {};

  return evolutions.reduce((acc, evolution) => {
    const millesime = formatMillesime(evolution.millesimeSortie);
    const tauxValue = evolution[taux];
    if (tauxValue !== undefined) {
      acc[millesime] = formatNumber(tauxValue, 4);
    }
    return acc;
  }, {} as Record<string, number>);
};

export const getEvolutionTauxEntreeKeys = () => {
  return [
    `${parseInt(CURRENT_RENTREE) - 2}`,
    `${parseInt(CURRENT_RENTREE) - 1}`,
    `${CURRENT_RENTREE}`,
  ];
};

export const getEvolutionTauxEntreeData = ({
  taux,
  evolutions
}: {
  taux: "tauxPression" | "tauxDemande" | "tauxRemplissage";
  evolutions?: Array<{
    rentreeScolaire: string;
    tauxPression?: number;
    tauxDemande?: number;
    tauxRemplissage?: number;
  }>
}) => {
  if (!evolutions) return {};

  return evolutions.reduce((acc, evolution) => {
    const rentreeScolaire = evolution.rentreeScolaire;
    const tauxValue = evolution[taux];
    if (tauxValue !== undefined) {
      acc[rentreeScolaire] = formatNumber(tauxValue, 4);
    }
    return acc;
  }, {} as Record<string, number>);
};
