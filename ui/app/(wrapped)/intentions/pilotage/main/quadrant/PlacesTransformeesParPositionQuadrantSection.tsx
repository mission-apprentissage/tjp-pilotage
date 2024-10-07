import {
  Box,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  PositionQuadrantEnum,
  PositionQuadrantType,
} from "shared/enum/positionQuadrantEnum";

import { TooltipIcon } from "@/components/TooltipIcon";
import { formatPercentage } from "@/utils/formatUtils";

import { BarChart } from "../../components/BarChart";
import {
  FormationsPilotageIntentions,
  RepartitionPilotageIntentionsPositionQuadrant,
} from "../../types";

type StatsPositionQuadrant = {
  ["Places fermées"]: number;
  ["Places ouvertes"]: number;
  ["Colorations"]: number;
  ["Places transformées"]: number;
  ["Solde"]: number;
  ["Effectif en entrée"]: number;
  ["Taux de transformation"]: string;
  ["Ratio de fermeture"]: string;
};

const getStatsPositionQuadrant = (
  positionsQuadrant: RepartitionPilotageIntentionsPositionQuadrant,
  positionQuadrant: PositionQuadrantType
): StatsPositionQuadrant => {
  const statsPositionQuadrant: StatsPositionQuadrant = {
    ["Places fermées"]: 0,
    ["Places ouvertes"]: 0,
    ["Colorations"]: 0,
    ["Places transformées"]: 0,
    ["Solde"]: 0,
    ["Effectif en entrée"]: 0,
    ["Taux de transformation"]: "-",
    ["Ratio de fermeture"]: "-",
  };

  statsPositionQuadrant["Places fermées"] =
    positionsQuadrant?.[positionQuadrant]?.placesFermees ?? 0;
  statsPositionQuadrant["Places ouvertes"] =
    positionsQuadrant?.[positionQuadrant]?.placesOuvertes ?? 0;
  statsPositionQuadrant["Colorations"] =
    positionsQuadrant?.[positionQuadrant]?.placesColorees ?? 0;
  statsPositionQuadrant["Places transformées"] =
    positionsQuadrant?.[positionQuadrant]?.placesTransformees ?? 0;
  statsPositionQuadrant["Solde"] =
    positionsQuadrant?.[positionQuadrant]?.solde ?? 0;
  statsPositionQuadrant["Effectif en entrée"] =
    positionsQuadrant?.[positionQuadrant]?.effectif ?? 0;

  statsPositionQuadrant["Taux de transformation"] = formatPercentage(
    statsPositionQuadrant["Places transformées"] /
      statsPositionQuadrant["Effectif en entrée"],
    1
  );
  statsPositionQuadrant["Ratio de fermeture"] = formatPercentage(
    statsPositionQuadrant["Places fermées"] /
      statsPositionQuadrant["Places transformées"],
    1
  );

  return statsPositionQuadrant;
};

const getTdColor = (
  key: keyof StatsPositionQuadrant,
  value: number | string
) => {
  if (key === "Solde") {
    return (value as number) < 0 ? "pilotage.red" : "pilotage.green.2";
  }
  return "";
};

export const PlacesTransformeesParPositionQuadrantSection = ({
  formations,
  positionsQuadrant,
}: {
  formations?: FormationsPilotageIntentions["formations"];
  positionsQuadrant?: RepartitionPilotageIntentionsPositionQuadrant;
}) => {
  if (!formations || !positionsQuadrant)
    return <Skeleton opacity={0.3} height="100%" />;

  const indicateursTableau: Array<keyof StatsPositionQuadrant> = [
    "Effectif en entrée",
    "Taux de transformation",
    "Solde",
  ];

  return (
    <Box width={"100%"}>
      <Box>
        <BarChart positionsQuadrant={positionsQuadrant} />
      </Box>
      <Box marginRight={"15%"} mt={12}>
        <Table variant="unstyled">
          <Thead>
            <Tr>
              <Th maxWidth={"200px"}></Th>
              <Th maxWidth={"100px"} px={3}>
                <Text align="center">{PositionQuadrantEnum.Q1}</Text>
              </Th>
              <Th maxWidth={"100px"} px={3}>
                <Text align="center">{PositionQuadrantEnum.Q2}</Text>
              </Th>
              <Th maxWidth={"100px"} px={3}>
                <Text align="center">{PositionQuadrantEnum.Q3}</Text>
              </Th>
              <Th maxWidth={"100px"} px={3}>
                <Text align="center">{PositionQuadrantEnum.Q4}</Text>
              </Th>
              <Th width={"100px"}>
                <Text align="center">
                  {PositionQuadrantEnum["Hors quadrant"]}
                </Text>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {indicateursTableau.map((indicateur) => (
              <Tr
                key={indicateur}
                borderTop={"1px solid"}
                borderColor={"grey.850"}
              >
                <Td width={200}>
                  {indicateur}
                  {indicateur === "Solde" && (
                    <TooltipIcon
                      label="Total des places ouvertes moins total des places fermées"
                      ms={2}
                    />
                  )}
                </Td>
                <Td
                  maxWidth={"100px"}
                  px={3}
                  color={getTdColor(
                    indicateur,
                    getStatsPositionQuadrant(
                      positionsQuadrant,
                      PositionQuadrantEnum.Q1
                    )[indicateur]
                  )}
                >
                  <Text align="center">
                    {
                      getStatsPositionQuadrant(
                        positionsQuadrant,
                        PositionQuadrantEnum.Q1
                      )[indicateur]
                    }
                  </Text>
                </Td>
                <Td
                  maxWidth={"100px"}
                  px={3}
                  color={getTdColor(
                    indicateur,
                    getStatsPositionQuadrant(
                      positionsQuadrant,
                      PositionQuadrantEnum.Q2
                    )[indicateur]
                  )}
                >
                  <Text align="center">
                    {
                      getStatsPositionQuadrant(
                        positionsQuadrant,
                        PositionQuadrantEnum.Q2
                      )[indicateur]
                    }
                  </Text>
                </Td>
                <Td
                  maxWidth={"100px"}
                  px={3}
                  color={getTdColor(
                    indicateur,
                    getStatsPositionQuadrant(
                      positionsQuadrant,
                      PositionQuadrantEnum.Q3
                    )[indicateur]
                  )}
                >
                  <Text align="center">
                    {
                      getStatsPositionQuadrant(
                        positionsQuadrant,
                        PositionQuadrantEnum.Q3
                      )[indicateur]
                    }
                  </Text>
                </Td>
                <Td
                  maxWidth={"100px"}
                  px={3}
                  color={getTdColor(
                    indicateur,
                    getStatsPositionQuadrant(
                      positionsQuadrant,
                      PositionQuadrantEnum.Q4
                    )[indicateur]
                  )}
                >
                  <Text align="center">
                    {
                      getStatsPositionQuadrant(
                        positionsQuadrant,
                        PositionQuadrantEnum.Q4
                      )[indicateur]
                    }
                  </Text>
                </Td>
                <Td
                  maxWidth={"100px"}
                  px={3}
                  color={getTdColor(
                    indicateur,
                    getStatsPositionQuadrant(
                      positionsQuadrant,
                      PositionQuadrantEnum["Hors quadrant"]
                    )[indicateur]
                  )}
                >
                  <Text align="center">
                    {
                      getStatsPositionQuadrant(
                        positionsQuadrant,
                        PositionQuadrantEnum["Hors quadrant"]
                      )[indicateur]
                    }
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
