import {
  Box,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Fragment } from "react";
import { PILOTAGE_REFORME_STATS_REGIONS_COLUMNS } from "shared";

import { OrderIcon } from "../../../../components/OrderIcon";
import { Order, PilotageReformeStatsRegion } from "../types";

const Loader = () => (
  <TableContainer overflowY={"auto"} flex={1} position="relative" height={"sm"}>
    <Table variant="striped" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
          //@ts-ignore
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
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export const VueRegionAcademieSection = ({
  data,
  isLoading,
  order,
  codeRegion,
  handleOrder,
}: {
  data?: PilotageReformeStatsRegion;
  isLoading: boolean;
  order: Order;
  codeRegion?: string;
  handleOrder: (column: Order["orderBy"]) => void;
}) => {
  return (
    <>
      <Text fontSize={20} fontWeight={700} lineHeight={"34px"}>
        VUE DÉTAILLÉE DES INDICATEURS PAR RÉGIONS & ACADÉMIES
      </Text>
      <Box borderRadius={4} border={"1px solid"} borderColor="grey.900" p={4}>
        {isLoading ? (
          <Loader />
        ) : (
          <TableContainer
            overflowY={"auto"}
            flex={1}
            position="relative"
            height={"sm"}
          >
            <Table variant="striped" size={"sm"}>
              <Thead
                position="sticky"
                top="0"
                bg="white"
                boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
                zIndex={1}
              >
                <Tr>
                  <Th
                    cursor="pointer"
                    pb="4"
                    onClick={() => handleOrder("libelleRegion")}
                  >
                    <OrderIcon {...order} column="libelleRegion" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.libelleRegion}
                  </Th>
                  <Th
                    isNumeric
                    cursor="pointer"
                    pb="4"
                    width="20%"
                    onClick={() => handleOrder("tauxInsertion6mois")}
                  >
                    <OrderIcon {...order} column="tauxInsertion6mois" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxInsertion6mois}
                  </Th>
                  <Th
                    isNumeric
                    cursor="pointer"
                    pb="4"
                    width="20%"
                    onClick={() => handleOrder("tauxPoursuiteEtudes")}
                  >
                    <OrderIcon {...order} column="tauxPoursuiteEtudes" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxPoursuiteEtudes}
                  </Th>
                  <Th
                    isNumeric
                    cursor="pointer"
                    pb="4"
                    width="20%"
                    onClick={() => handleOrder("tauxDecrochage")}
                  >
                    <OrderIcon {...order} column="tauxDecrochage" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxDecrochage}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Fragment>
                  {data?.statsRegions.map((region) => {
                    const trBgColor =
                      region.codeRegion === codeRegion
                        ? "#5770BE !important"
                        : "";

                    const tdBgColor =
                      region.codeRegion === codeRegion
                        ? "inherit !important"
                        : "";

                    const trColor =
                      region.codeRegion === codeRegion ? "white" : "inherit";

                    const color =
                      region.codeRegion === codeRegion ? "inherit" : "#000091";

                    return (
                      <Fragment
                        key={`${region.codeRegion}_${region.libelleRegion}`}
                      >
                        <Tr
                          backgroundColor={trBgColor}
                          color={trColor}
                          fontWeight="700"
                        >
                          <Td backgroundColor={tdBgColor} color={color}>
                            {region.libelleRegion}
                          </Td>
                          <Td isNumeric backgroundColor={tdBgColor}>
                            {region.tauxInsertion6mois}
                          </Td>
                          <Td isNumeric backgroundColor={tdBgColor}>
                            {region.tauxPoursuiteEtudes}
                          </Td>
                          <Td isNumeric backgroundColor={tdBgColor}>
                            {region.tauxDecrochage}
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
      </Box>
    </>
  );
};
