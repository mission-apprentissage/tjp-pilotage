import {
  Box,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Fragment } from "react";

import { OrderIcon } from "../../../../../components/OrderIcon";
import { TooltipIcon } from "../../../../../components/TooltipIcon";
import { TauxPressionScale } from "../../../components/TauxPressionScale";
import { STATS_DEMANDES_COLUMNS } from "../STATS_DEMANDES_COLUMN";
import { Order, StatsDemandes } from "../types";
import { LineContent } from "./LineContent";

const Loader = () => (
  <TableContainer
    overflowY={"auto"}
    flex={1}
    position="relative"
    height={"sm"}
    bg={"white"}
  >
    <Table variant="simple" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
          <Tr key={i} h="12">
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

export const ConsoleSection = ({
  data,
  isLoading,
  order,
  handleOrder,
}: {
  data?: StatsDemandes;
  isLoading: boolean;
  order: Order;
  handleOrder: (column: Order["orderBy"]) => void;
}) => {
  return (
    <Flex
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
      wrap={"wrap"}
      bg={"white"}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <TableContainer overflowY="auto" flex={1} position="relative">
          <Table variant="simple" size={"sm"}>
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
                  onClick={() => handleOrder("typeDemande")}
                >
                  <OrderIcon {...order} column="typeDemande" />
                  {STATS_DEMANDES_COLUMNS.typeDemande}
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("motif")}
                >
                  <OrderIcon {...order} column="motif" />
                  {STATS_DEMANDES_COLUMNS.motif}
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("niveauDiplome")}
                >
                  <OrderIcon {...order} column="niveauDiplome" />
                  {STATS_DEMANDES_COLUMNS.niveauDiplome}
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("libelleDiplome")}
                >
                  <OrderIcon {...order} column="libelleDiplome" />
                  {STATS_DEMANDES_COLUMNS.libelleDiplome}
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("libelleEtablissement")}
                >
                  <OrderIcon {...order} column="libelleEtablissement" />
                  {STATS_DEMANDES_COLUMNS.libelleEtablissement}
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("commune")}
                >
                  <OrderIcon {...order} column="commune" />
                  {STATS_DEMANDES_COLUMNS.commune}
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("libelleFiliere")}
                  minW={200}
                  maxW={200}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="libelleFiliere" />
                  {STATS_DEMANDES_COLUMNS.libelleFiliere}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("nbEtablissement")}
                  minW={200}
                  maxW={200}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="nbEtablissement" />
                  {STATS_DEMANDES_COLUMNS.nbEtablissement}
                  <TooltipIcon
                    ml="1"
                    label="Le nombre d'établissement dispensant la formation dans la région."
                  />
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("libelleRegion")}
                >
                  <OrderIcon {...order} column="libelleRegion" />
                  {STATS_DEMANDES_COLUMNS.libelleRegion}
                </Th>
                <Th
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("libelleDepartement")}
                >
                  <OrderIcon {...order} column="libelleDepartement" />
                  {STATS_DEMANDES_COLUMNS.libelleDepartement}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("differenceCapaciteScolaire")}
                  minW={150}
                  maxW={150}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="differenceCapaciteScolaire" />
                  {STATS_DEMANDES_COLUMNS.differenceCapaciteScolaire}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("differenceCapaciteApprentissage")}
                  minW={150}
                  maxW={150}
                  whiteSpace="normal"
                >
                  <OrderIcon
                    {...order}
                    column="differenceCapaciteApprentissage"
                  />
                  {STATS_DEMANDES_COLUMNS.differenceCapaciteApprentissage}
                </Th>
                <Th
                  textAlign="center"
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("insertion")}
                  minW={200}
                  maxW={200}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="insertion" />
                  {STATS_DEMANDES_COLUMNS.insertion}
                  <TooltipIcon
                    ml="1"
                    label="La part de ceux qui sont en emploi 6 mois après leur sortie d’étude pour cette formation à l'échelle régionale"
                  />
                </Th>
                <Th
                  textAlign="center"
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("poursuite")}
                  minW={250}
                  maxW={250}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="poursuite" />
                  {STATS_DEMANDES_COLUMNS.poursuite}
                  <TooltipIcon
                    ml="1"
                    label="Tout élève inscrit à N+1 (réorientation et redoublement compris) pour cette formation à l'échelle régionale."
                  />
                </Th>
                <Th
                  textAlign="center"
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("devenirFavorable")}
                  minW={220}
                  maxW={220}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="devenirFavorable" />
                  {STATS_DEMANDES_COLUMNS.devenirFavorable}
                  <TooltipIcon
                    ml="2"
                    label="Part des jeunes en emploi ou en poursuite d’étude pour cette formation à l'échelle régionale"
                  />
                </Th>
                <Th
                  textAlign="center"
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("pression")}
                  minW={170}
                  maxW={170}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="pression" />
                  {STATS_DEMANDES_COLUMNS.pression}
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
                <Th pb="4">{STATS_DEMANDES_COLUMNS.libelleColoration}</Th>
                <Th pb="4">{STATS_DEMANDES_COLUMNS.libelleFCIL}</Th>
                <Th pb="4">{STATS_DEMANDES_COLUMNS.commentaire}</Th>
                <Th pb="4">{STATS_DEMANDES_COLUMNS.positionCadran}</Th>
                <Th pb="4">{STATS_DEMANDES_COLUMNS.id}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Fragment>
                {data?.demandes.map((demande: StatsDemandes["demandes"][0]) => {
                  return (
                    <Fragment key={`${demande.id}`}>
                      <Tr h="12" _hover={{ bg: "blue.faded" }}>
                        <LineContent demande={demande} />
                      </Tr>
                    </Fragment>
                  );
                })}
              </Fragment>
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Flex>
  );
};
