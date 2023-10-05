import {
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
import { STATS_DEMANDES_COLUMNS } from "shared";

import { GraphWrapper } from "../../../../components/GraphWrapper";
import { OrderIcon } from "../../../../components/OrderIcon";
import { getMotifLabel, MotifLabel } from "../../utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "../../utils/typeDemandeUtils";
import { Order, StatsDemandes } from "../types";

const Loader = () => (
  <TableContainer overflowY={"auto"} flex={1} position="relative" height={"sm"}>
    <Table variant="striped" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
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
    <>
      <Flex
        borderRadius={4}
        border={"1px solid"}
        borderColor="grey.900"
        p={4}
        mb={36}
        wrap={"wrap"}
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
                    {STATS_DEMANDES_COLUMNS.motifs}
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
                    onClick={() => handleOrder("libelleFiliere")}
                  >
                    <OrderIcon {...order} column="libelleFiliere" />
                    {STATS_DEMANDES_COLUMNS.libelleFiliere}
                  </Th>
                  <Th
                    cursor="pointer"
                    pb="4"
                    onClick={() => handleOrder("libelleDepartement")}
                  >
                    <OrderIcon {...order} column="libelleDepartement" />
                    {STATS_DEMANDES_COLUMNS.libelleDepartement}
                  </Th>
                  <Th isNumeric pb="4">
                    {STATS_DEMANDES_COLUMNS.differenceCapaciteScolaire}
                  </Th>
                  <Th isNumeric pb="4">
                    {STATS_DEMANDES_COLUMNS.differenceCapaciteApprentissage}
                  </Th>
                  <Th
                    isNumeric
                    cursor="pointer"
                    pb="4"
                    onClick={() => handleOrder("insertion")}
                  >
                    <OrderIcon {...order} column="insertion" />
                    {STATS_DEMANDES_COLUMNS.insertion}
                  </Th>
                  <Th
                    isNumeric
                    cursor="pointer"
                    pb="4"
                    onClick={() => handleOrder("poursuite")}
                  >
                    <OrderIcon {...order} column="poursuite" />
                    {STATS_DEMANDES_COLUMNS.poursuite}
                  </Th>
                  <Th
                    isNumeric
                    cursor="pointer"
                    pb="4"
                    onClick={() => handleOrder("devenirFavorable")}
                  >
                    <OrderIcon {...order} column="devenirFavorable" />
                    {STATS_DEMANDES_COLUMNS.devenirFavorable}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Fragment>
                  {data?.demandes.map((demande) => {
                    return (
                      <Fragment key={`${demande.id}`}>
                        <Tr h="12">
                          <Td pr="0" py="1">
                            {getTypeDemandeLabel(demande.typeDemande)}
                          </Td>
                          <Td>
                            {demande.motif ? (
                              demande.motif.map(
                                (m: string, index: number) =>
                                  `${getMotifLabel(m as MotifLabel)}${
                                    demande.motif &&
                                    demande.motif.length - 1 > index
                                      ? ", "
                                      : ""
                                  }
                                    `
                              )
                            ) : (
                              <></>
                            )}
                          </Td>
                          <Td>{demande.libelleDiplome}</Td>
                          <Td>{demande.libelleEtablissement}</Td>
                          <Td>{demande.libelleFiliere}</Td>
                          <Td>{demande.libelleDepartement}</Td>
                          <Td isNumeric>
                            {(demande.capaciteScolaire ?? 0) -
                              (demande.capaciteScolaireActuelle ?? 0)}
                          </Td>
                          <Td isNumeric>
                            {(demande.capaciteApprentissage ?? 0) -
                              (demande.capaciteApprentissageActuelle ?? 0)}
                          </Td>
                          <Td isNumeric>
                            <GraphWrapper value={demande.insertion} />
                          </Td>
                          <Td isNumeric>
                            <GraphWrapper value={demande.poursuite} />
                          </Td>
                          <Td isNumeric>
                            <GraphWrapper value={demande.devenirFavorable} />
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
      </Flex>
    </>
  );
};
