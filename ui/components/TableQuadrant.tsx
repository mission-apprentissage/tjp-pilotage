import { Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { CURRENT_IJ_MILLESIME } from "shared";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import { TooltipDefinitionTauxDePression } from "@/app/(wrapped)/components/definitions/DefinitionTauxDePression";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { formatNumber, formatNumberToString } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { GraphWrapper } from "./GraphWrapper";
import { OrderIcon } from "./OrderIcon";
import { TableBadge } from "./TableBadge";

type Formation = {
  libelleFormation?: string;
  libelleDispositif?: string;
  libelleNiveauDiplome?: string;
  tauxPoursuite?: number;
  tauxInsertion?: number;
  tauxPression?: number;
  effectif?: number;
  positionQuadrant?: string;
  cfd?: string;
  codeDispositif?: string;
  continuum?: { cfd: string; libelleFormation?: string };
};

export const TableQuadrant = ({
  formations,
  handleOrder,
  handleClick,
  currentFormationId,
  order,
}: {
  formations: Formation[];
  handleOrder?: (column?: string) => void;
  handleClick?: (value?: string) => void;
  currentFormationId?: string;
  order?: {
    order?: "asc" | "desc";
    orderBy?: string;
  };
}) => {
  const getTdColor = (formation: Formation) => {
    if (currentFormationId && `${formation.cfd}_${formation.codeDispositif}` === currentFormationId)
      return "white !important";
    return "";
  };

  const getTrBgColor = (formation: Formation) => {
    if (currentFormationId && `${formation.cfd}_${formation.codeDispositif}` === currentFormationId)
      return "blueecume.400_hover !important";
    switch (formation.positionQuadrant) {
    case PositionQuadrantEnum.Q1:
      return "green.submitted";
    case PositionQuadrantEnum.Q4:
      return "redmarianne.925";
    default:
      return "inherit";
    }
  };
  return (
    <Flex direction="column" flex={1} position="relative" minH="0">
      <TableContainer overflowY="auto" flex={1} position="relative" width="100%">
        <Table variant="simple" size={"sm"} mb={"auto"}>
          <Thead
            bgColor="blueecume.400_active"
            h="12"
            position="sticky"
            top="0"
            boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
            zIndex={1}
          >
            <Tr>
              <Th
                px="2"
                maxW="40%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("libelleFormation")}
              >
                {handleOrder && <OrderIcon {...order} column="libelleFormation" />}
                FORMATION
              </Th>
              <Th
                px="2"
                maxW="20%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("tauxPression")}
                textAlign={"center"}
              >
                {handleOrder && <OrderIcon {...order} column="tauxPression" />}
                TX PRESSION
                <TooltipDefinitionTauxDePression />
              </Th>
              <Th
                px="2"
                maxW="20%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("tauxInsertion")}
                textAlign={"center"}
              >
                {handleOrder && <OrderIcon {...order} column="tauxInsertion" />}
                TX EMPLOI
                <TooltipDefinitionTauxEmploi6Mois />
              </Th>
              <Th
                px="2"
                maxW="20%"
                color="white"
                cursor={handleOrder ? "pointer" : "default"}
                onClick={() => handleOrder && handleOrder("tauxPoursuite")}
                textAlign={"center"}
              >
                {handleOrder && <OrderIcon {...order} column="tauxPoursuite" />}
                TX POURSUITE
                <TooltipDefinitionTauxPoursuiteEtudes />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {formations
              .filter((formation) => formation.effectif)
              .map((f) => ({
                ...f,
                libelle: formations.some(
                  (formation) => formation.cfd === f.cfd && formation.codeDispositif !== f.codeDispositif
                )
                  ? f.libelleFormation?.replace(`(${f.libelleNiveauDiplome})`, `(${f.libelleDispositif})`)
                  : f.libelleFormation,
              }))
              .map((formation, index) => (
                <Tr
                  key={`${formation.cfd}-${index}`}
                  bgColor={getTrBgColor(formation)}
                  onClick={() => handleClick && handleClick(`${formation.cfd}_${formation.codeDispositif}`)}
                  cursor={handleClick ? "pointer" : "default"}
                >
                  <Td whiteSpace="normal" color={getTdColor(formation)}>
                    {formation.libelle}
                  </Td>
                  <Td textAlign={"center"}>
                    <TableBadge sx={
                      getTauxPressionStyle(
                        formation.tauxPression !== undefined ?
                          formatNumber(formation.tauxPression, 2) :
                          undefined
                      )
                    }>
                      {formatNumberToString(formation.tauxPression, 2, "-")}
                    </TableBadge>
                  </Td>
                  <Td color={getTdColor(formation)} maxW="20%">
                    <GraphWrapper maxW="120px" value={formation.tauxInsertion} continuum={formation.continuum} millesime={CURRENT_IJ_MILLESIME} />
                  </Td>
                  <Td color={getTdColor(formation)} maxW="20%">
                    <GraphWrapper maxW="120px" value={formation.tauxPoursuite} continuum={formation.continuum} millesime={CURRENT_IJ_MILLESIME} />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
