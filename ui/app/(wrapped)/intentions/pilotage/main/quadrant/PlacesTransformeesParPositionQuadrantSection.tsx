import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

import { FormationsPilotageIntentions } from "@/app/(wrapped)/intentions/pilotage/types";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatPercentage } from "@/utils/formatUtils";

import { BarChart } from "../../components/BarChart";

type PositionQuadrant = "Q1" | "Q2" | "Q3" | "Q4" | "Hors quadrant";

type StatsPositionQuadrant = {
  ["Places fermées"]: number;
  ["Places ouvertes"]: number;
  ["Places colorées"]: number;
  ["Places transformées"]: number;
  ["Solde"]: number;
  ["Effectif en entrée"]: number;
  ["Taux de transformation"]: string;
  ["Ratio de fermeture"]: string;
};

export const PlacesTransformeesParPositionQuadrantSection = ({
  formations,
}: {
  formations?: FormationsPilotageIntentions["formations"];
}) => {
  if (!formations) return <></>;

  const indicateursTableau: Array<keyof StatsPositionQuadrant> = [
    "Effectif en entrée",
    "Taux de transformation",
    "Solde",
  ];

  const getStatsPositionQuadrant = (
    positionQuadrant: PositionQuadrant
  ): StatsPositionQuadrant => {
    const statsPositionQuadrant: StatsPositionQuadrant = {
      ["Places fermées"]: 0,
      ["Places ouvertes"]: 0,
      ["Places colorées"]: 0,
      ["Places transformées"]: 0,
      ["Solde"]: 0,
      ["Effectif en entrée"]: 0,
      ["Taux de transformation"]: "-",
      ["Ratio de fermeture"]: "-",
    };

    formations
      .filter((formation) => formation.positionQuadrant === positionQuadrant)
      .map((formation) => {
        if (statsPositionQuadrant) {
          statsPositionQuadrant["Places fermées"] += formation.placesFermees;
          statsPositionQuadrant["Places ouvertes"] += formation.placesOuvertes;
          statsPositionQuadrant["Places colorées"] += formation.placesColorees;
          statsPositionQuadrant["Effectif en entrée"] += formation.effectif;
          statsPositionQuadrant["Places transformées"] +=
            formation.placesTransformees;
          statsPositionQuadrant["Solde"] +=
            formation.placesOuvertes - formation.placesFermees;
        }
      });

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

  const getTdBgColor = (
    key: keyof StatsPositionQuadrant,
    value: number | string
  ) => {
    if (key === "Solde") {
      return (value as number) < 0 ? "pilotage.red" : "pilotage.green.2";
    }
    return "";
  };

  return (
    <>
      <Box width={"100%"}>
        <Box>
          <BarChart formations={formations} />
        </Box>
        <Box marginRight={"15%"} mt={12}>
          <Table variant="unstyled">
            <Thead>
              <Tr>
                <Th maxWidth={"200px"}></Th>
                <Th maxWidth={"100px"} px={3}>
                  <Text align="center">Q1</Text>
                </Th>
                <Th maxWidth={"100px"} px={3}>
                  <Text align="center">Q2</Text>
                </Th>
                <Th maxWidth={"100px"} px={3}>
                  <Text align="center">Q3</Text>
                </Th>
                <Th maxWidth={"100px"} px={3}>
                  <Text align="center">Q4</Text>
                </Th>
                <Th width={"100px"}>
                  <Text align="center">Hors quadrant</Text>
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
                    bgColor={getTdBgColor(
                      indicateur,
                      getStatsPositionQuadrant("Q1")[indicateur]
                    )}
                  >
                    <Text
                      align="center"
                      bgColor={getTdBgColor(
                        indicateur,
                        getStatsPositionQuadrant("Q1")[indicateur]
                      )}
                    >
                      {getStatsPositionQuadrant("Q1")[indicateur]}
                    </Text>
                  </Td>
                  <Td
                    maxWidth={"100px"}
                    px={3}
                    bgColor={getTdBgColor(
                      indicateur,
                      getStatsPositionQuadrant("Q2")[indicateur]
                    )}
                  >
                    <Text align="center">
                      {getStatsPositionQuadrant("Q2")[indicateur]}
                    </Text>
                  </Td>
                  <Td
                    maxWidth={"100px"}
                    px={3}
                    bgColor={getTdBgColor(
                      indicateur,
                      getStatsPositionQuadrant("Q3")[indicateur]
                    )}
                  >
                    <Text align="center">
                      {getStatsPositionQuadrant("Q3")[indicateur]}
                    </Text>
                  </Td>
                  <Td
                    maxWidth={"100px"}
                    px={3}
                    bgColor={getTdBgColor(
                      indicateur,
                      getStatsPositionQuadrant("Q4")[indicateur]
                    )}
                  >
                    <Text align="center">
                      {getStatsPositionQuadrant("Q4")[indicateur]}
                    </Text>
                  </Td>
                  <Td
                    maxWidth={"100px"}
                    px={3}
                    bgColor={getTdBgColor(
                      indicateur,
                      getStatsPositionQuadrant("Hors quadrant")[indicateur]
                    )}
                  >
                    <Text align="center">
                      {getStatsPositionQuadrant("Hors quadrant")[indicateur]}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </>
  );
};
