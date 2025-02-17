import { Box, Heading, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useMemo } from 'react';

import type { Order, PilotageReformeStatsRegion } from "@/app/(wrapped)/pilotage-reforme/types";
import { GlossaireShortcut } from '@/components/GlossaireShortcut';
import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatPercentageFixedDigits } from "@/utils/formatUtils";

const PILOTAGE_REFORME_STATS_REGIONS_COLUMNS = {
  libelleRegion: "Région",
  tauxInsertion: "Emploi à 6 mois",
  tauxPoursuite: "Poursuite d'études",
  tauxChomage: "Taux de chômage",
  tauxTransformationCumule: "Taux de transfo. cumulé",
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
  nationalStats,
  onModalOpen,
}: {
  data?: PilotageReformeStatsRegion;
  isLoading: boolean;
  order: Order;
  codeRegion?: string;
  handleOrder: (column: Order["orderBy"]) => void;
  onModalOpen: () => void;
  nationalStats: {
    tauxTransformationCumule?: number;
    tauxPoursuite?: number;
    tauxInsertion?: number;
    tauxChomage?: number;
  }
}) => {
  const rows = useMemo(() => { return data?.statsRegions.map((region) => {
    const trBgColor = region.codeRegion === codeRegion ? "blueecume.400_hover !important" : "";
    const tdBgColor = region.codeRegion === codeRegion ? "inherit !important" : "";
    const trColor = region.codeRegion === codeRegion ? "white" : "inherit";
    const color = region.codeRegion === codeRegion ? "inherit" : "bluefrance.113";

    return (
      <Tr  key={`${region.codeRegion}_${region.libelleRegion}`} backgroundColor={trBgColor} color={trColor} fontWeight="700">
        <Td backgroundColor={tdBgColor} color={color}>
          {region.libelleRegion}
        </Td>
        <Td isNumeric backgroundColor={tdBgColor}>
          {formatPercentageFixedDigits(region.tauxTransformationCumule, 1, "-")}
        </Td>
        <Td isNumeric backgroundColor={tdBgColor}>
          {formatPercentageFixedDigits(region.tauxPoursuite, 1, "-")}
        </Td>
        <Td isNumeric backgroundColor={tdBgColor}>
          {formatPercentageFixedDigits(region.tauxInsertion, 1, "-")}
        </Td>
        <Td isNumeric backgroundColor={tdBgColor}>
          {formatPercentageFixedDigits(region.tauxChomage, 1, "-")}
        </Td>
      </Tr>
    );
  });}, [data, codeRegion]);

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
                  <Th isNumeric cursor="pointer" pb="4" width="20%" onClick={() => handleOrder("tauxTransformationCumule")}>
                    <OrderIcon {...order} column="tauxTransformationCumule" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxTransformationCumule}
                    <TooltipIcon
                      display={"inline"}
                      marginInline={1}
                      label={
                        <Box>
                          <Text>Taux de transformation cumulé par région.</Text>
                        </Box>
                      }
                      onClick={() => onModalOpen()}
                    />
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" width="20%" onClick={() => handleOrder("tauxPoursuite")}>
                    <OrderIcon {...order} column="tauxPoursuite" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxPoursuite}
                    <GlossaireShortcut
                      display={"inline"}
                      marginInline={1}
                      iconSize={"12px"}
                      glossaireEntryKey={"taux-poursuite-etudes"}
                      tooltip={
                        <Box>
                          <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
                          <Text>Cliquez pour plus d'infos.</Text>
                        </Box>
                      }
                    />
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" width="20%" onClick={() => handleOrder("tauxInsertion")}>
                    <OrderIcon {...order} column="tauxInsertion" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxInsertion}
                    <GlossaireShortcut
                      display={"inline"}
                      marginInline={1}
                      iconSize={"12px"}
                      glossaireEntryKey={"taux-emploi-6-mois"}
                      tooltip={
                        <Box>
                          <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’étude.</Text>
                          <Text>Cliquez pour plus d'infos.</Text>
                        </Box>
                      }
                    />
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" width="20%" onClick={() => handleOrder("tauxChomage")}>
                    <OrderIcon {...order} column="tauxChomage" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxChomage}
                    <TooltipIcon ml="1" label="T4 2022"/>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {rows}
                {/* National stats */}
                <Tr fontWeight="700" color={"bluefrance.113"} borderTop={"2px solid"} borderColor="bluefrance.113">
                  <Td fontWeight="700">
                    NATIONAL
                  </Td>
                  <Td isNumeric  >
                    {formatPercentageFixedDigits(nationalStats.tauxTransformationCumule, 1, "-")}
                  </Td>
                  <Td isNumeric >
                    {formatPercentageFixedDigits(nationalStats.tauxPoursuite, 1, "-")}
                  </Td>
                  <Td isNumeric >
                    {formatPercentageFixedDigits(nationalStats.tauxInsertion, 1, "-")}
                  </Td>
                  <Td isNumeric >
                    {formatPercentageFixedDigits(nationalStats.tauxChomage, 1, "-")}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
};
