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
import { OrderIcon } from "../../../../../components/OrderIcon";
import { Order, PilotageTransformationStats } from "../types";

const Loader = () => (
  <TableContainer overflowY={"auto"} flex={1} position="relative" height={"sm"}>
    <Table variant="striped" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
          <Tr key={i} bg={"grey.975"}>
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

export const VueOuverturesFermeturesSection = ({
  data,
  isLoading,
  codeRegion,
  order,
  handleOrder,
}: {
  data?: PilotageTransformationStats;
  isLoading: boolean;
  codeRegion?: string;
  order: Order;
  handleOrder: (column: Order["orderBy"]) => void;
}) => {
  const getNombrePlace = (
    type: "ouverture" | "fermeture",
    region: PilotageTransformationStats["all"]["regions"][string]
  ): number => {
    return type === "ouverture"
      ? region.placesOuvertesScolaire + region.placesOuvertesApprentissage
      : region.placesFermeesScolaire + region.placesFermeesApprentissage;
  };

  const getRatio = (
    type: "ouverture" | "fermeture",
    region: PilotageTransformationStats["all"]["regions"][string]
  ): string => {
    return type === "ouverture"
      ? (
          (getNombrePlace("ouverture", region) /
            (getNombrePlace("ouverture", region) +
              getNombrePlace("fermeture", region))) *
          100
        ).toFixed(2)
      : (
          (getNombrePlace("fermeture", region) /
            (getNombrePlace("ouverture", region) +
              getNombrePlace("fermeture", region))) *
          100
        ).toFixed(2);
  };

  const legendElements = [
    { label: "< 33%", color: useToken("colors", "pilotage.red") },
  ];

  return (
    <Flex
      flexDirection={"column"}
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
      bg="white"
    >
      <Text
        fontSize={14}
        fontWeight={700}
        lineHeight={"20px"}
        color={"bluefrance.113"}
        mb="5"
      >
        Ratio des ouvertures et fermetures par région
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
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("libelle")}
                >
                  <OrderIcon {...order} column="libelle" />
                  Région
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  width="10%"
                  whiteSpace="normal"
                  onClick={() => handleOrder("placesFermees")}
                >
                  <OrderIcon {...order} column="placesFermees" />
                  Nb fermetures
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  width="10%"
                  whiteSpace="normal"
                  onClick={() => handleOrder("placesOuvertes")}
                >
                  <OrderIcon {...order} column="placesOuvertes" />
                  Nb ouvertures
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  width="10%"
                  whiteSpace="normal"
                  onClick={() => handleOrder("ratioFermeture")}
                >
                  <OrderIcon {...order} column="ratioFermeture" />
                  Ratio fermetures
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  width="10%"
                  whiteSpace="normal"
                  onClick={() => handleOrder("ratioOuverture")}
                >
                  <OrderIcon {...order} column="ratioOuverture" />
                  Ratio ouvertures
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Fragment>
                {Object.values(data?.all?.regions ?? []).map((region) => {
                  const trBgColor =
                    region.codeRegion === codeRegion
                      ? "blueecume.400_hover !important"
                      : "";

                  const tdBgColor =
                    region.codeRegion === codeRegion
                      ? "inherit !important"
                      : "";

                  const trColor =
                    region.codeRegion === codeRegion ? "white" : "inherit";

                  const color =
                    region.codeRegion === codeRegion
                      ? "inherit"
                      : "bluefrance.113";

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
                        <Td isNumeric backgroundColor={tdBgColor}>
                          {getNombrePlace("fermeture", region)}
                        </Td>
                        <Td isNumeric backgroundColor={tdBgColor}>
                          {getNombrePlace("ouverture", region)}
                        </Td>
                        <Td
                          isNumeric
                          backgroundColor={
                            parseFloat(getRatio("fermeture", region)) < 30
                              ? "pilotage.red !important"
                              : "inherit"
                          }
                        >
                          {getRatio("fermeture", region)}%
                        </Td>
                        <Td isNumeric backgroundColor={tdBgColor}>
                          {getRatio("ouverture", region)}%
                        </Td>
                      </Tr>
                    </Fragment>
                  );
                })}
              </Fragment>
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Legend elements={legendElements} />
    </Flex>
  );
};
