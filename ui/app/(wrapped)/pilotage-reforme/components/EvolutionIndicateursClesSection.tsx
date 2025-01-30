import {Box, Flex, Heading,Select, Skeleton, VisuallyHidden} from '@chakra-ui/react';
import _ from "lodash";
import type { OptionType } from "shared/schema/optionSchema";

import type { IndicateurType, PilotageReformeStats } from "@/app/(wrapped)/pilotage-reforme/types";

import type { BarGraphData } from "./BarGraph";
import { BarGraph } from "./BarGraph";

export const EvolutionIndicateursClesSection = ({
  data,
  isLoading,
  isFiltered = false,
  codeRegion,
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
}: {
  data?: PilotageReformeStats;
  isLoading: boolean;
  isFiltered?: boolean | string;
  codeRegion?: string;
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: (OptionType & { isDefault: boolean })[];
}) => {
  const graphData: BarGraphData = {};

  data?.annees.forEach((anneeData) => {
    graphData[anneeData.annee.toString()] = {
      annee: anneeData.annee.toString(),
      libelleAnnee: anneeData.millesime.join("+"),
      filtered: (anneeData.scoped[indicateur] ?? 0) * 100,
      nationale: (anneeData.nationale[indicateur] ?? 0) * 100,
    };
  });

  const getLibelleRegion = (regions?: Array<{ label: string; value: string }>, codeRegion?: string) => {
    return _.find(regions, (region) => region.value === codeRegion)?.label;
  };

  const libelleRegion = isFiltered ? getLibelleRegion(data?.filters?.regions, codeRegion) : "";

  return (
    <Box borderRadius={4} border={"1px solid"} borderColor="grey.900" bg="white" p={3} height={"328"} mt={8}>
      {isLoading ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Heading
              as="h2"
              fontSize={15}
              fontWeight="500"
              textTransform={"uppercase"}
              color={"bluefrance.113"}
            >
              Évolution des indicateurs clés
            </Heading>
            <VisuallyHidden as="label" htmlFor="select-indicateur-evolution-indicateur-cles">Indicateur</VisuallyHidden>
            <Select
              id="select-indicateur-evolution-indicateur-cles"
              width="64"
              size="sm"
              variant="newInput"
              bg={"grey.150"}
              onChange={(e) => handleIndicateurChange(e.target.value)}
              value={indicateur}
            >
              {indicateurOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label.toUpperCase()}
                </option>
              ))}
            </Select>
          </Flex>
          <BarGraph graphData={graphData} isFiltered={isFiltered} libelleRegion={libelleRegion} />
        </Box>
      )}
    </Box>
  );
};
