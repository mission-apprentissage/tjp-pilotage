import {Box, Heading,Skeleton, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';
import { Fragment } from "react";

import type { Order, PilotageReformeStatsRegion } from "@/app/(wrapped)/pilotage-reforme/types";
import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatPercentage } from "@/utils/formatUtils";

const PILOTAGE_REFORME_STATS_REGIONS_COLUMNS = {
  libelleRegion: "Région",
  tauxInsertion: "Emploi",
  tauxPoursuite: "Poursuite",
  tauxChomage: "Taux de chômage",
};

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
      <Heading
        as="h1"
        fontSize={20}
        fontWeight={700}
        lineHeight={"34px"}
        textTransform={"uppercase"}
      >
        Vue détaillée des indicateurs par région
      </Heading>
      <Box borderRadius={4} border={"1px solid"} borderColor="grey.900" p={4} mb={36} bg="white">
        {isLoading ? (
          <Loader />
        ) : (
          <TableContainer flex={1} position="relative">
            <Table variant="striped" size={"sm"}>
              <Thead position="sticky" top="0" bg="white" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" zIndex={1}>
                <Tr>
                  <Th cursor="pointer" pb="4" onClick={() => handleOrder("libelleRegion")}>
                    <OrderIcon {...order} column="libelleRegion" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.libelleRegion}
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" width="20%" onClick={() => handleOrder("tauxPoursuite")}>
                    <OrderIcon {...order} column="tauxPoursuite" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxPoursuite}
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" width="20%" onClick={() => handleOrder("tauxInsertion")}>
                    <OrderIcon {...order} column="tauxInsertion" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxInsertion}
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" width="20%" onClick={() => handleOrder("tauxChomage")}>
                    <OrderIcon {...order} column="tauxChomage" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxChomage}
                    <TooltipIcon ml="1" label="T4 2022" />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Fragment>
                  {data?.statsRegions.map((region) => {
                    const trBgColor = region.codeRegion === codeRegion ? "blueecume.400_hover !important" : "";

                    const tdBgColor = region.codeRegion === codeRegion ? "inherit !important" : "";

                    const trColor = region.codeRegion === codeRegion ? "white" : "inherit";

                    const color = region.codeRegion === codeRegion ? "inherit" : "bluefrance.113";

                    return (
                      <Fragment key={`${region.codeRegion}_${region.libelleRegion}`}>
                        <Tr backgroundColor={trBgColor} color={trColor} fontWeight="700">
                          <Td backgroundColor={tdBgColor} color={color}>
                            {region.libelleRegion}
                          </Td>
                          <Td isNumeric backgroundColor={tdBgColor}>
                            {formatPercentage(region.tauxPoursuite ?? 0)}
                          </Td>
                          <Td isNumeric backgroundColor={tdBgColor}>
                            {formatPercentage(region.tauxInsertion ?? 0)}
                          </Td>
                          <Td isNumeric backgroundColor={tdBgColor}>
                            {region.tauxChomage ?? "-"} %
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
