import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { TauxPressionScale } from "../app/(wrapped)/components/TauxPressionScale";
import { getTauxPressionStyle } from "../utils/getBgScale";
import { GraphWrapper } from "./GraphWrapper";
import { OrderIcon } from "./OrderIcon";
import { TableBadge } from "./TableBadge";
import { TooltipIcon } from "./TooltipIcon";

type Formation = {
  libelleDiplome?: string;
  tauxPoursuite?: number;
  tauxInsertion?: number;
  tauxPression?: number;
  positionQuadrant?: string;
  cfd?: string;
};

export const TableQuadrant = ({
  formations,
  handleOrder,
  handleClick,
  currentCfd,
  order,
}: {
  formations: Formation[];
  handleOrder?: (column?: string) => void;
  handleClick?: (value?: string) => void;
  currentCfd?: string;
  order?: {
    order?: "asc" | "desc";
    orderBy?: string;
  };
}) => {
  const getTdColor = (formation: Formation) => {
    if (currentCfd && formation.cfd === currentCfd) return "white !important";
    return "";
  };

  const getTrBgColor = (formation: Formation) => {
    if (currentCfd && formation.cfd === currentCfd)
      return "blue.main !important";
    switch (formation.positionQuadrant) {
      case "Q1":
        return "#C8F6D6";
      case "Q4":
        return "#ffe2e1";
      default:
        return "inherit";
    }
  };
  return (
    <Flex direction="column" flex={1} position="relative" minH="0">
      <TableContainer
        overflowY="auto"
        flex={1}
        position="relative"
        width="100%"
      >
        <Table variant="simple" size={"sm"} mb={"auto"}>
          <Thead
            bgColor="#96A6D8"
            h="12"
            position="sticky"
            top="0"
            boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
            zIndex={1}
          >
            <Tr>
              <Th
                maxW="40%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("libelleDiplome")}
              >
                {handleOrder && (
                  <OrderIcon {...order} column="libelleDiplome" />
                )}
                FORMATION
              </Th>
              <Th
                maxW="20%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("tauxPression")}
              >
                {handleOrder && <OrderIcon {...order} column="tauxPression" />}
                TX PRESSION
                <TooltipIcon
                  ml="1"
                  label={
                    <>
                      <Box>
                        Le ratio entre le nombre de premiers voeux et la
                        capacité de la formation au niveau régional.
                      </Box>
                      <TauxPressionScale />
                    </>
                  }
                />
              </Th>
              <Th
                maxW="20%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("tauxInsertion")}
              >
                {handleOrder && <OrderIcon {...order} column="tauxInsertion" />}
                TX EMPLOI
              </Th>
              <Th
                maxW="20%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("tauxPoursuite")}
              >
                {handleOrder && <OrderIcon {...order} column="tauxPoursuite" />}
                TX POURSUITE
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {formations.map((formation, index) => (
              <Tr
                key={`${formation.cfd}-${index}`}
                bgColor={getTrBgColor(formation)}
                onClick={() => handleClick && handleClick(formation.cfd)}
                cursor={handleClick ? "pointer" : "default"}
              >
                <Td whiteSpace="normal" color={getTdColor(formation)}>
                  {formation.libelleDiplome}
                </Td>
                <Td textAlign={"center"} color={getTdColor(formation)}>
                  <TableBadge
                    sx={getTauxPressionStyle(
                      formation.tauxPression !== undefined
                        ? formation.tauxPression / 100
                        : undefined
                    )}
                  >
                    {formation.tauxPression !== undefined
                      ? formation.tauxPression / 100
                      : "-"}
                  </TableBadge>
                </Td>
                <Td color={getTdColor(formation)} maxW="20%">
                  <GraphWrapper maxW="130px" value={formation.tauxInsertion} />
                </Td>
                <Td color={getTdColor(formation)} maxW="20%">
                  <GraphWrapper maxW="130px" value={formation.tauxPoursuite} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
