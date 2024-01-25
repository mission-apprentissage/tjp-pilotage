import { Box, Flex, Select, Skeleton, Text, useToken } from "@chakra-ui/react";
import { useCallback } from "react";
import { ScopeEnum } from "shared";

import { client } from "@/api.client";

import { CartoGraph } from "../../../../../components/CartoGraph";
import { Filters, IndicateurType, Order, SelectedScope } from "../types";

type Props = {
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: {
    label: string;
    value: string;
    isDefault: boolean;
  }[];
  filters: Partial<Filters>;
  order: Partial<Order>;
  scope: SelectedScope;
  handleFilters: (filters: Partial<Filters>) => void;
};

export const CartoSection = ({
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
  filters,
  order,
  scope,
  handleFilters,
}: Props) => {
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

  const { data, isLoading } = client
    .ref("[GET]/pilotage-transformation/get-scoped-transformations-stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          scope:
            scope.type === ScopeEnum.national ? ScopeEnum.region : scope.type,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

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
  }, [scope, data]);

  const handleClickOnTerritoire = useCallback(
    (code: string | undefined) =>
      handleFilters({
        scope: scope.type,
        code: scope.value === code ? undefined : code,
      }),
    [handleFilters, scope]
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
      {isLoading ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Text color={"bluefrance.113"} fontWeight={700}>
              VISUALISATION TERRITORIALE
            </Text>
            <Flex flexDirection={"column"} position={"relative"} zIndex={100}>
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
              scope={scope.type}
              customPiecesSteps={getCustomPieces()}
              customColorPalette={getCustomPalette()}
              handleClick={handleClickOnTerritoire}
              selectedScope={scope}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
