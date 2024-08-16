import { Box, Flex, Select, Skeleton, Text, useToken } from "@chakra-ui/react";
import { useCallback } from "react";
import { ScopeEnum } from "shared";

import { CartoGraph } from "@/components/CartoGraph";

import { useScopeCode } from "../hooks";
import {
  FiltersStatsPilotageIntentions,
  StatsPilotageIntentions,
} from "../types";
export type IndicateurType = "tauxTransformation" | "ratioFermeture";

type Props = {
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: {
    label: string;
    value: string;
    isDefault: boolean;
  }[];
  filters: FiltersStatsPilotageIntentions;
  handleFilters: (filters: Partial<FiltersStatsPilotageIntentions>) => void;
  data: StatsPilotageIntentions | undefined;
};

export const CartoSection = ({
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
  filters,
  handleFilters,
  data,
}: Props) => {
  const { code: scopeCode } = useScopeCode(filters);

  const customPalette = [
    useToken("colors", "pilotage.red"),
    useToken("colors", "pilotage.orange"),
    useToken("colors", "pilotage.yellow"),
    useToken("colors", "pilotage.green.1"),
    useToken("colors", "pilotage.green.2"),
    useToken("colors", "pilotage.green.3"),
  ];

  const getCustomPalette = () => {
    switch (indicateur) {
      case "tauxTransformation":
        return customPalette;
      case "ratioFermeture":
        return [
          customPalette[0],
          customPalette[1],
          customPalette[2],
          customPalette[4],
        ];
    }
  };

  const getCustomPieces = () => {
    switch (indicateur) {
      case "tauxTransformation":
        return [
          [0, 1],
          [1, 2],
          [2, 4],
          [4, 5],
          [5, 6],
          [6, 10000],
        ];
      case "ratioFermeture":
        return [
          [0, 15],
          [15, 25],
          [25, 30],
          [30, 100],
        ];
    }
  };

  const getGraphData = useCallback(() => {
    if (!data) {
      return [];
    }

    return Object.values(data?.all).map((territoire) => ({
      name: territoire.libelle,
      parentName: territoire.libelleAcademie,
      value:
        territoire.effectif || indicateur != "tauxTransformation"
          ? territoire[indicateur] ?? 0
          : undefined,
      code: territoire.code,
    }));
  }, [data, filters]);

  const handleClickOnTerritoire = useCallback(
    (code: string | undefined) =>
      handleFilters({
        scope: filters.scope,
        codeRegion:
          filters.scope === ScopeEnum.region && scopeCode === code
            ? undefined
            : code,
        codeAcademie:
          filters.scope === ScopeEnum.academie && scopeCode === code
            ? undefined
            : code,
        codeDepartement:
          filters.scope === ScopeEnum.departement && scopeCode === code
            ? undefined
            : code,
      }),
    [handleFilters, filters, scopeCode]
  );

  return (
    <Box
      flex={1}
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      bg="white"
      p={3}
      mt={12}
    >
      {data === undefined ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Text color={"bluefrance.113"} fontWeight={700}>
              VISUALISATION TERRITORIALE
            </Text>
            <Flex flexDirection={"column"} position={"relative"} zIndex={1}>
              <Select
                width="64"
                size="sm"
                variant="newInput"
                bg={"grey.150"}
                onChange={(e) => handleIndicateurChange(e.target.value)}
                value={indicateur}
                borderBottomColor={
                  typeof indicateur !== "undefined" ? "info.525" : ""
                }
              >
                {indicateurOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label.toUpperCase()}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
          <Box mt={"-20"}>
            <CartoGraph
              graphData={getGraphData()}
              scope={filters.scope}
              customPiecesSteps={getCustomPieces()}
              customColorPalette={getCustomPalette()}
              handleClick={handleClickOnTerritoire}
              selectedScope={{
                type: filters.scope,
                value: scopeCode ?? "national",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
