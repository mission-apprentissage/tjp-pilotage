import { Flex, Tooltip } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from 'shared';
import { getMillesime } from 'shared/utils/getMillesime';

import { themeDefinition } from "@/theme/theme";
import { formatMillesime } from '@/utils/formatLibelle';
import { formatNumber } from '@/utils/formatUtils';

export const getEvolutionTauxSortieKeys = () => {
  return [
    formatMillesime(getMillesime({millesimeSortie: CURRENT_IJ_MILLESIME, offset: -2})),
    formatMillesime(getMillesime({millesimeSortie: CURRENT_IJ_MILLESIME, offset: -1})),
    formatMillesime(getMillesime({millesimeSortie: CURRENT_IJ_MILLESIME, offset: 0})),
  ];
};

export const getEvolutionPositionQuadrantData = ({
  evolutions
}: {
  evolutions?: Array<{
    millesimeSortie: string;
    positionQuadrant?: string;
  }>
}) => {
  if (!evolutions) return {};

  return evolutions.reduce((acc, evolution) => {
    const millesime = formatMillesime(evolution.millesimeSortie);
    const value = evolution.positionQuadrant;
    if (value !== undefined) {
      acc[millesime] = value;
    }
    return acc;
  }, {} as Record<string, string>);
};

export const getEvolutionTauxSortieData = ({
  key,
  evolutions
}: {
  key: "tauxInsertion" | "tauxPoursuite" | "tauxDevenirFavorable";
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
    const tauxValue = evolution[key];
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
  key,
  evolutions
}: {
  key: "tauxPression" | "tauxDemande" | "tauxRemplissage" | "capacite" | "effectif";
  evolutions?: Array<{
    rentreeScolaire: string;
    tauxPression?: number;
    tauxDemande?: number;
    tauxRemplissage?: number;
    capacite?: number;
    effectif?: number;
  }>
}) => {
  if (!evolutions) return {};

  return evolutions.reduce((acc, evolution) => {
    const rentreeScolaire = evolution.rentreeScolaire;
    const tauxValue = evolution[key];
    if (tauxValue !== undefined) {
      acc[rentreeScolaire] = formatNumber(tauxValue, 4);
    }
    return acc;
  }, {} as Record<string, number>);
};

export const getEvolutionIcon = ({
  data
} : {
  data: Record<string, number | undefined>;
}): ReactNode | undefined => {
  const values = Object.values(data).filter((value) => value !== undefined);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];

  if (values.length < 2 || firstValue === undefined || lastValue === undefined) return undefined;
  if (firstValue > lastValue) {
    return (
      <Flex my={"auto"}>
        <Tooltip label="Tendance à la baisse" placement="top">
          <Icon icon={"ri:arrow-right-down-line"} color={themeDefinition.colors.redmarianne[625]} width={"16px"}/>
        </Tooltip>
      </Flex>
    );
  }
  if (firstValue < lastValue) {
    return (
      <Flex my={"auto"}>
        <Tooltip label="Tendance à la hausse" placement="top">
          <Icon icon={"ri:arrow-right-up-line"} color={themeDefinition.colors.greenArchipel[557]} width={"16px"}/>
        </Tooltip>
      </Flex>
    );
  }
  if (firstValue === lastValue) {
    return (
      <Flex my={"auto"}>
        <Tooltip label="Tendance stable" placement="top">
          <Icon icon={"ri:arrow-right-line"} color={themeDefinition.colors.bluefrance[625]} width={"16px"}/>
        </Tooltip>
      </Flex>
    );
  }
};
