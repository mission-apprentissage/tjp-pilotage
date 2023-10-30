import {
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToken,
} from "@chakra-ui/react";
import { Fragment } from "react";

import { Legend } from "../../../../../components/Legend";
import { PilotageTransformationStats } from "../types";

const Loader = () => (
  <TableContainer overflowY={"auto"} flex={1} position="relative" height={"sm"}>
    <Table variant="striped" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
          <Tr key={i} bg={"#f5f5f5"}>
            <Td>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export const VueTauxTransformationSection = ({
  data,
  isLoading,
  codeRegion,
}: {
  data?: PilotageTransformationStats;
  isLoading: boolean;
  codeRegion?: string;
}) => {
  const customPalette = [
    useToken("colors", "pilotage.red"),
    useToken("colors", "pilotage.orange"),
    useToken("colors", "pilotage.yellow"),
    useToken("colors", "pilotage.green.1"),
    useToken("colors", "pilotage.green.2"),
    useToken("colors", "pilotage.green.3"),
  ];

  const legendElements = [
    { label: "< 1%", color: customPalette[0] },
    { label: "< 2%", color: customPalette[1] },
    { label: "< 4%", color: customPalette[2] },
    { label: "< 5%", color: customPalette[3] },
    { label: "< 6%", color: customPalette[4] },
    { label: "> 6%", color: customPalette[5] },
  ];

  return (
    <Flex
      flexDirection={"column"}
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
      mb={36}
      bg="white"
    >
      <Text
        fontSize={14}
        fontWeight={700}
        lineHeight={"20px"}
        color={"bluefrance.113"}
        mb="5"
      >
        Nombre de places transformées et taux de transformation régional
      </Text>
      {isLoading ? (
        <Loader />
      ) : (
        <TableContainer flex={1} position="relative">
          <Table variant="striped" size={"sm"}>
            <Thead
              position="sticky"
              top="0"
              bg="white"
              boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
              zIndex={1}
              height="16"
            >
              <Tr>
                <Th cursor="pointer" pb="4">
                  Région
                </Th>
                <Th isNumeric cursor="pointer" pb="4" width="20%">
                  Places transformées
                </Th>
                <Th isNumeric cursor="pointer" pb="4" width="20%">
                  Taux de transformation
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Fragment>
                {Object.values(data?.all?.regions ?? []).map((region) => {
                  const trBgColor =
                    region.codeRegion === codeRegion
                      ? "blue.main !important"
                      : "";

                  const tdBgColor =
                    region.codeRegion === codeRegion
                      ? "inherit !important"
                      : "";

                  const getTdBgColor = (indicateur: number) => {
                    if (indicateur <= 1) return customPalette[0];
                    if (indicateur <= 2) return customPalette[1];
                    if (indicateur <= 4) return customPalette[2];
                    if (indicateur <= 5) return customPalette[3];
                    if (indicateur <= 6) return customPalette[4];
                    if (indicateur > 6) return customPalette[5];
                  };

                  const trColor =
                    region.codeRegion === codeRegion ? "white" : "inherit";

                  const color =
                    region.codeRegion === codeRegion ? "inherit" : "#000091";

                  return (
                    <Fragment key={`${region.codeRegion}_${region.libelle}`}>
                      <Tr
                        backgroundColor={trBgColor}
                        color={trColor}
                        fontWeight="700"
                      >
                        <Td backgroundColor={tdBgColor} color={color}>
                          {region.libelle}
                        </Td>
                        <Td isNumeric>
                          {region.placesOuvertesScolaire +
                            region.placesOuvertesApprentissage +
                            region.placesFermeesScolaire +
                            region.placesFermeesApprentissage}
                        </Td>
                        <Td
                          isNumeric
                          backgroundColor={getTdBgColor(
                            region.tauxTransformation
                          )}
                        >
                          {region.tauxTransformation}%
                        </Td>
                      </Tr>
                    </Fragment>
                  );
                })}
              </Fragment>
            </Tbody>
          </Table>
          <Legend elements={legendElements} />
        </TableContainer>
      )}
    </Flex>
  );
};
