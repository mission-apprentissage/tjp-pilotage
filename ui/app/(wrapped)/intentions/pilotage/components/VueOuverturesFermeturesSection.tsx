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
import { displayPercentage } from "../../../../../utils/displayPercent";
import { Order, ScopedTransformationStats, SelectedScope } from "../types";

const SEUIL_RATIO_FERMETURE = 33;

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

const ScopedTable = ({
  isLoading,
  handleOrder,
  order,
  data,
  scope,
  title,
  columnTitle,
}: {
  data?: ScopedTransformationStats;
  order: Partial<Order>;
  isLoading: boolean;
  handleOrder: (column: Order["orderBy"]) => void;
  scope: SelectedScope;
  title: string;
  columnTitle: string;
}) => {
  const legendElements = [
    {
      label: `< ${SEUIL_RATIO_FERMETURE}%`,
      color: useToken("colors", "pilotage.red"),
    },
  ];

  return (
    <Flex
      flexDirection={"column"}
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
      bg="white"
      maxH={"750px"}
      overflowY={"auto"}
    >
      <Text
        fontSize={14}
        fontWeight={700}
        lineHeight={"20px"}
        color={"bluefrance.113"}
        mb="5"
      >
        {title}
      </Text>
      {isLoading ? (
        <Loader />
      ) : (
        <TableContainer flex={1} position="relative" overflowY={"auto"}>
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
                  {columnTitle}
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
                {Object.values(data ?? []).map((territoire) => {
                  const trBgColor =
                    territoire.code === scope.value
                      ? "blueecume.400_hover !important"
                      : "";

                  const tdBgColor =
                    territoire.code === scope.value ? "inherit !important" : "";

                  const trColor =
                    territoire.code === scope.value ? "white" : "inherit";

                  const color =
                    territoire.code === scope.value
                      ? "inherit"
                      : "bluefrance.113";

                  return (
                    <Fragment key={`${territoire.code}_${territoire.libelle}`}>
                      <Tr
                        backgroundColor={trBgColor}
                        color={trColor}
                        fontWeight="700"
                      >
                        <Td backgroundColor={tdBgColor} color={color}>
                          {territoire.libelle}
                        </Td>
                        <Td isNumeric backgroundColor={tdBgColor}>
                          {territoire.placesFermees}
                        </Td>
                        <Td isNumeric backgroundColor={tdBgColor}>
                          {territoire.placesOuvertes}
                        </Td>
                        <Td
                          isNumeric
                          backgroundColor={
                            territoire.ratioFermeture < SEUIL_RATIO_FERMETURE
                              ? "pilotage.red !important"
                              : "inherit"
                          }
                          color={
                            territoire.ratioFermeture < SEUIL_RATIO_FERMETURE
                              ? "black"
                              : "inherit"
                          }
                        >
                          {displayPercentage(territoire.ratioFermeture / 100)}
                        </Td>
                        <Td isNumeric backgroundColor={tdBgColor}>
                          {displayPercentage(territoire.ratioOuverture / 100)}
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

const getTitle = (scope: SelectedScope) =>
  ({
    nationals: "Ratio des ouvertures et fermetures par région",
    regions: "Ratio des ouvertures et fermetures par région",
    academies: "Ratio des ouvertures et fermetures par académie",
    departements: "Ratio des ouvertures et fermetures par département",
  })[scope.type];

const getColumnTitle = (scope: SelectedScope) =>
  ({
    nationals: "Région",
    regions: "Région",
    academies: "Académie",
    departements: "Département",
  })[scope.type];

export const VueOuverturesFermeturesSection = (props: {
  data?: ScopedTransformationStats;
  scope: SelectedScope;
  isLoading: boolean;
  codeRegion?: string;
  order: Order;
  handleOrder: (column: Order["orderBy"]) => void;
}) => (
  <ScopedTable
    {...props}
    title={getTitle(props.scope)}
    columnTitle={getColumnTitle(props.scope)}
  />
);
