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
import { useState } from "react";

import { CartoGraph } from "../../../../../components/CartoGraph";
import { IndicateurType, PilotageTransformationStats, Scope } from "../types";

export const CartoSection = ({
  data,
  isLoading,
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
}: {
  data?: PilotageTransformationStats;
  isLoading: boolean;
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: {
    label: string;
    value: string;
    isDefault: boolean;
  }[];
}) => {
  const [scope, setScope] = useState<Scope>("regions");

  const getGraphData = () => {
    if (scope && data?.all[scope])
      return Object.values(data?.all[scope]).map((territoire) => {
        return {
          name: territoire.libelle,
          value: territoire[indicateur] ?? 0,
        };
      });
    return [];
  };

  return (
    <Box
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      bg="white"
      p={3}
      height={"601"}
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
                onChange={(value) => setScope(value as Scope)}
                defaultChecked
                defaultValue={scope}
                zIndex={"banner"}
              >
                <Flex flexDirection={"column"}>
                  <Radio
                    value="regions"
                    isChecked={scope === "regions"}
                    defaultChecked={scope === "regions"}
                  >
                    Régions
                  </Radio>
                  <Radio
                    value="academies"
                    isChecked={scope === "academies"}
                    defaultChecked={scope === "academies"}
                  >
                    Académies
                  </Radio>
                  <Radio
                    value="departements"
                    isChecked={scope === "departements"}
                    defaultChecked={scope === "departements"}
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
              scope={scope}
              customPiecesSteps={[
                [0, 1],
                [1, 2],
                [2, 4],
                [4, 5],
                [5, 6],
                [6, 100],
              ]}
              customColorPalette={[
                useToken("colors", "pilotage.red"),
                useToken("colors", "pilotage.orange"),
                useToken("colors", "pilotage.yellow"),
                useToken("colors", "pilotage.green.1"),
                useToken("colors", "pilotage.green.2"),
                useToken("colors", "pilotage.green.3"),
              ]}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
