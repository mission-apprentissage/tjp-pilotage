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
import { useCallback } from "react";

import { Legend } from "@/components/Legend";
import { OrderIcon } from "@/components/OrderIcon";

import { displayPercentage } from "../../../../../utils/displayPercent";
import { Order, ScopedTransformationStats, SelectedScope } from "../types";

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

export const ScopedTable = ({
  isLoading,
  title,
  data,
  handleOrder,
  order,
  scopeColumnTitle,
  scope,
}: {
  isLoading: boolean;
  title: string;
  scopeColumnTitle: string;
  data: ScopedTransformationStats | undefined;
  handleOrder: (column: Order["orderBy"]) => void;
  order: Partial<Order>;
  scope: SelectedScope;
}) => {
  const customPalette = [
    useToken("colors", "pilotage.red !important"),
    useToken("colors", "pilotage.orange !important"),
    useToken("colors", "pilotage.yellow !important"),
    useToken("colors", "pilotage.green.1 !important"),
    useToken("colors", "pilotage.green.2 !important"),
    useToken("colors", "pilotage.green.3 !important"),
  ];

  const legendElements = [
    { label: "< 1%", color: customPalette[0] },
    { label: "< 2%", color: customPalette[1] },
    { label: "< 4%", color: customPalette[2] },
    { label: "< 5%", color: customPalette[3] },
    { label: "< 6%", color: customPalette[4] },
    { label: "> 6%", color: customPalette[5] },
  ];

  const getTdBgColor = useCallback(
    (indicateur: number | undefined) => {
      if (typeof indicateur === "undefined") {
        return undefined;
      }
      if (indicateur <= 1) return customPalette[0];
      if (indicateur <= 2) return customPalette[1];
      if (indicateur <= 4) return customPalette[2];
      if (indicateur <= 5) return customPalette[3];
      if (indicateur <= 6) return customPalette[4];
      if (indicateur > 6) return customPalette[5];
    },
    [customPalette]
  );

  return (
    <Flex
      flexDirection={"column"}
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
      bg="white"
      maxH={"750px"}
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
                  {scopeColumnTitle}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  width="20%"
                  whiteSpace={"normal"}
                  onClick={() => handleOrder("placesTransformees")}
                >
                  <OrderIcon {...order} column="placesTransformees" />
                  Places transformées
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  width="20%"
                  whiteSpace={"normal"}
                  onClick={() => handleOrder("effectif")}
                >
                  <OrderIcon {...order} column="effectif" />
                  Effectif en entrée
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  width="20%"
                  whiteSpace={"normal"}
                  onClick={() => handleOrder("tauxTransformation")}
                >
                  <OrderIcon {...order} column="tauxTransformation" />
                  Taux de transformation
                </Th>
              </Tr>
            </Thead>
            <Tbody>
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

                const tauxTransformation =
                  typeof territoire.tauxTransformation === "undefined"
                    ? "-"
                    : displayPercentage(territoire.tauxTransformation / 100);

                return (
                  <Tr
                    backgroundColor={trBgColor}
                    color={trColor}
                    fontWeight="700"
                    key={`${territoire.code}_${territoire.libelle}`}
                  >
                    <Td backgroundColor={tdBgColor} color={color}>
                      {territoire.libelle}
                    </Td>
                    <Td isNumeric backgroundColor={tdBgColor} color={color}>
                      {territoire.placesTransformees}
                    </Td>
                    <Td isNumeric backgroundColor={tdBgColor} color={color}>
                      {territoire.effectif}
                    </Td>
                    <Td
                      isNumeric
                      backgroundColor={getTdBgColor(
                        territoire.tauxTransformation
                      )}
                      color={"black"}
                    >
                      {tauxTransformation}
                    </Td>
                  </Tr>
                );
              })}
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
    national:
      "Nombre de places transformées et taux de transformation régional",
    regions: "Nombre de places transformées et taux de transformation régional",
    academies:
      "Nombre de places transformées et taux de transformation académique",
    departements:
      "Nombre de places transformées et taux de transformation départemental",
  })[scope.type];

const getColumnTitle = (scope: SelectedScope) =>
  ({
    national: "Région",
    regions: "Région",
    academies: "Académie",
    departements: "Département",
  })[scope.type];

export const VueTauxTransformationSection = (props: {
  handleOrder: (column: Order["orderBy"]) => void;
  order: Partial<Order>;
  scope: SelectedScope;
  data: ScopedTransformationStats | undefined;
  isLoading: boolean;
}) => (
  <ScopedTable
    {...props}
    title={getTitle(props.scope)}
    scopeColumnTitle={getColumnTitle(props.scope)}
  />
);
