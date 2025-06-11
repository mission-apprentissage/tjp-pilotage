import { Box, Flex, Heading, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import { useMemo } from 'react';
import { ANNEE_CHOMAGE } from 'shared';

import { TooltipDefinitionTauxEmploi6Mois } from '@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois';
import { TooltipDefinitionTauxPoursuiteEtudes } from '@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes';
import type { Order, PilotageReformeStatsRegion, TauxTransformation } from "@/app/(wrapped)/suivi-impact/types";
import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatPercentageFixedDigits } from "@/utils/formatUtils";

const PILOTAGE_REFORME_STATS_REGIONS_COLUMNS = {
  libelleRegion: "Région",
  tauxInsertion: "Taux d'emploi à 6 mois",
  tauxPoursuite: "Taux de poursuite d'études",
  tauxChomage: "Taux de chômage",
  tauxTransformationCumule: "Taux de transfo. cumulé",
  tauxTransformationCumulePrevisionnel: "Taux de transfo. cumulé prévisionnel",
};

const Loader = () => (
  <TableContainer overflowY={"auto"} flex={1} position="relative" height={"sm"}>
    <Table variant="striped" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((row, i) => row + i).map((row) => (
          <Tr key={row} bg={"grey.975"}>
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
    tauxTransformationCumule?: TauxTransformation;
    tauxTransformationCumulePrevisionnel?: TauxTransformation;
    tauxPoursuite?: number;
    tauxInsertion?: number;
    tauxChomage?: number;
  } | undefined;
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
          <Tooltip label={ region.tauxTransformationCumule?.placesTransformees && region.tauxTransformationCumule?.effectifs && `${region.tauxTransformationCumule?.placesTransformees} / ${region.tauxTransformationCumule?.effectifs}`}>
            {formatPercentageFixedDigits(region.tauxTransformationCumule?.taux, 1, "-")}
          </Tooltip>
        </Td>
        <Td isNumeric backgroundColor={tdBgColor}>
          <Tooltip label={ region.tauxTransformationCumulePrevisionnel?.placesTransformees && region.tauxTransformationCumulePrevisionnel?.effectifs && `${region.tauxTransformationCumulePrevisionnel?.placesTransformees} / ${region.tauxTransformationCumulePrevisionnel?.effectifs}`}>
            {formatPercentageFixedDigits(region.tauxTransformationCumulePrevisionnel?.taux, 1, "-")}
          </Tooltip>
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
                  <Th isNumeric cursor="pointer" pb="4"  onClick={() => handleOrder("tauxTransformationCumule")}>
                    <Flex alignItems="center">
                      <OrderIcon {...order} column="tauxTransformationCumule" />
                      <Text align="left">
                      Taux de transfo. cumulé
                        <br/>
                      (Demandes validées)
                      </Text>
                      <TooltipIcon
                        display={"inline"}
                        marginInline={1}
                        label={
                          <Box>
                            <Text>Taux de transformation cumulé par région (demandes validées).{" "}
                              Cliquer pour plus d’infos.</Text>
                          </Box>
                        }
                        onClick={() => onModalOpen()}
                      />
                    </Flex>
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" onClick={() => handleOrder("tauxTransformationCumulePrevisionnel")}>
                    <Flex alignItems="center">
                      <OrderIcon {...order} column="tauxTransformationCumulePrevisionnel" />
                      <Text align="left">
                        Taux de transfo. cumulé
                        <br/>
                        (Projets inclus)
                      </Text>
                      <TooltipIcon
                        display={"inline"}
                        marginInline={1}
                        label={
                          <Box>
                            <Text>Taux de transformation cumulé par région (projets inclus).{" "}
                              Cliquer pour plus d’infos.</Text>
                          </Box>
                        }
                        onClick={() => onModalOpen()}
                      />
                    </Flex>
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4"  onClick={() => handleOrder("tauxPoursuite")}>
                    <Flex alignItems="center">
                      <OrderIcon {...order} column="tauxPoursuite"/>
                      <Text align="left">
                          Taux de poursuite
                        <br/>
                          d'études
                      </Text>
                      <TooltipDefinitionTauxPoursuiteEtudes />
                    </Flex>
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4"  onClick={() => handleOrder("tauxInsertion")}>
                    <Flex alignItems="center">
                      <OrderIcon {...order} column="tauxInsertion" />
                      <Text align="left">
                        Taux d'emploi
                        <br/>
                        à 6 mois
                      </Text>
                      <TooltipDefinitionTauxEmploi6Mois />
                    </Flex>
                  </Th>
                  <Th isNumeric cursor="pointer" pb="4" width="15%" onClick={() => handleOrder("tauxChomage")}>
                    <OrderIcon {...order} column="tauxChomage" />
                    {PILOTAGE_REFORME_STATS_REGIONS_COLUMNS.tauxChomage}
                    <TooltipIcon ml="1" label={`T4 ${ANNEE_CHOMAGE}`}/>
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
                  <Td isNumeric >
                    <Tooltip label={ nationalStats?.tauxTransformationCumule?.placesTransformees && nationalStats?.tauxTransformationCumule?.effectifs && `${nationalStats?.tauxTransformationCumule?.placesTransformees} / ${nationalStats?.tauxTransformationCumule?.effectifs}`}>
                      {formatPercentageFixedDigits(nationalStats?.tauxTransformationCumule?.taux, 1, "-")}
                    </Tooltip>
                  </Td>
                  <Td isNumeric >
                    <Tooltip label={ nationalStats?.tauxTransformationCumulePrevisionnel?.placesTransformees && nationalStats?.tauxTransformationCumulePrevisionnel?.effectifs && `${nationalStats?.tauxTransformationCumulePrevisionnel?.placesTransformees} / ${nationalStats?.tauxTransformationCumulePrevisionnel?.effectifs}`}>
                      {formatPercentageFixedDigits(nationalStats?.tauxTransformationCumulePrevisionnel?.taux, 1, "-")}
                    </Tooltip>
                  </Td>
                  <Td isNumeric >
                    {formatPercentageFixedDigits(nationalStats?.tauxPoursuite, 1, "-")}
                  </Td>
                  <Td isNumeric >
                    {formatPercentageFixedDigits(nationalStats?.tauxInsertion, 1, "-")}
                  </Td>
                  <Td isNumeric >
                    {formatPercentageFixedDigits(nationalStats?.tauxChomage, 1, "-")}
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
