import { client } from "@/api.client";
import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Text,
  useToken,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { CartoGraph } from "../../../../../components/CartoGraph";
import { Filters, IndicateurType, Order, Scope, SelectedScope } from "../types";

type Props = {
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: {
    label: string;
    value: string;
    isDefault: boolean;
  }[];
  filters: Partial<Filters>;
  resetScope: VoidFunction;
  order: Partial<Order>;
  scope: SelectedScope;
  setScope: (scope: SelectedScope) => void;
};

export const CartoSection = ({
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
  filters,
  order,
  scope,
  setScope,
  resetScope,
}: Props) => {
  const [cartoScope, setCartoScope] = useState<Scope>(
    scope.type === "national" ? "regions" : scope.type
  );
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
          [6, 100],
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
    .ref("[GET]/pilotage-transformation/stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          scope: cartoScope,
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

    return Object.values(data.all).map((territoire) => ({
      name: territoire.libelle,
      parentName: territoire.libelleAcademie,
      value: territoire[indicateur] ?? 0,
    }));
  }, [scope, data]);

  const handleClickOnTerritoire = useCallback(
    (code: string | undefined) => {
      if (scope.type === cartoScope && scope.value === code) {
        resetScope();
      } else {
        setScope({ type: cartoScope, value: code! });
      }
    },
    [setScope, cartoScope]
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
            <Flex flexDirection={"column"}>
              <Select
                width="64"
                size="sm"
                variant="newInput"
                bg={"grey.150"}
                onChange={(e) => handleIndicateurChange(e.target.value)}
                value={indicateur}
                borderBottomColor={indicateur != undefined ? "info.525" : ""}
              >
                {indicateurOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label.toUpperCase()}
                  </option>
                ))}
              </Select>
              <RadioGroup
                mt="3"
                ms="auto"
                justifyContent={"end"}
                onChange={(value) => setCartoScope(value as Scope)}
                defaultChecked
                defaultValue={cartoScope}
                zIndex={"dropdown"}
              >
                <Flex flexDirection={"column"}>
                  <Radio
                    value="regions"
                    isChecked={cartoScope === "regions"}
                    defaultChecked={cartoScope === "regions"}
                  >
                    Régions
                  </Radio>
                  <Radio
                    value="academies"
                    isChecked={cartoScope === "academies"}
                    defaultChecked={cartoScope === "academies"}
                  >
                    Académies
                  </Radio>
                  <Radio
                    value="departements"
                    isChecked={cartoScope === "departements"}
                    defaultChecked={cartoScope === "departements"}
                  >
                    Départements
                  </Radio>
                </Flex>
              </RadioGroup>
            </Flex>
          </Flex>
          <Box mt={"-20"}>
            <CartoGraph
              graphData={getGraphData()}
              scope={cartoScope}
              customPiecesSteps={getCustomPieces()}
              customColorPalette={getCustomPalette()}
              handleClick={handleClickOnTerritoire}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
