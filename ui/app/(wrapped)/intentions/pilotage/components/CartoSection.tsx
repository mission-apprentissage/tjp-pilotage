import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Text,
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
  const getGraphData = () => {
    switch (scope) {
      case "regions":
        if (data?.all?.regions)
          return Object.values(data?.draft?.regions).map((region) => {
            return {
              name: region.libelleRegion,
              value: region[indicateur] ?? 0,
            };
          });
        break;
      case "academies":
        if (data?.all?.academies)
          return Object.values(data?.draft?.academies).map((academie) => {
            return {
              name: academie.libelleAcademie,
              value: academie[indicateur] ?? 0,
            };
          });
        break;
      case "departements":
        if (data?.all?.departements)
          return Object.values(data?.draft?.departements).map((departement) => {
            return {
              name: departement.libelleDepartement,
              value: departement[indicateur] ?? 0,
            };
          });
        break;
    }
    return [];
  };

  const [scope, setScope] = useState<Scope>("regions");

  return (
    <Box
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      bg="white"
      p={3}
      height={"661"}
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
              >
                <Flex flexDirection={"column"}>
                  <Radio value="regions">Régions</Radio>
                  <Radio value="academies">Académies</Radio>
                  <Radio value="departements">Départements</Radio>
                </Flex>
              </RadioGroup>
            </Flex>
          </Flex>
          <CartoGraph
            graphData={getGraphData()}
            scope={scope}
            customPiecesSteps={[0, 3, 5, 6]}
          />
        </Box>
      )}
    </Box>
  );
};
