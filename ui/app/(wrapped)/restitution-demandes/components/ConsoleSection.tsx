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
    <Table variant="simple" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
          <Tr key={i} bg={"#f5f5f5"} h="12">
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
  const handleMotifLabel = (motif?: string[], autreMotif?: string) => {
    return motif ? (
      motif.map(
        (motifLabel: string, index: number) =>
          `${
            motifLabel === "autre"
              ? `Autre : ${autreMotif}`
              : getMotifLabel(motifLabel as MotifLabel)
          }${motif && motif.length - 1 > index ? ", " : ""}`
      )
    ) : (
      <></>
    );
  };

  return (
    <Flex
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
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
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("insertion")}
                  minW={200}
                  maxW={200}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="insertion" />
                  {STATS_DEMANDES_COLUMNS.insertion}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("poursuite")}
                  minW={200}
                  maxW={200}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="poursuite" />
                  {STATS_DEMANDES_COLUMNS.poursuite}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("devenirFavorable")}
                  minW={200}
                  maxW={200}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="devenirFavorable" />
                  {STATS_DEMANDES_COLUMNS.devenirFavorable}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  pb="4"
                  onClick={() => handleOrder("pression")}
                  minW={200}
                  maxW={200}
                  whiteSpace="normal"
                >
                  <OrderIcon {...order} column="pression" />
                  {STATS_DEMANDES_COLUMNS.pression}
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
                        <Td
                          minW={300}
                          maxW={300}
                          whiteSpace="normal"
                          textOverflow={"ellipsis"}
                          isTruncated={true}
                        >
                          {handleMotifLabel(demande.motif, demande.autreMotif)}
                        </Td>
                        <Td>{demande.niveauDiplome}</Td>
                        <Td minW={300} maxW={300} whiteSpace="normal">
                          {demande.libelleDiplome}
                        </Td>
                        <Td minW={300} maxW={300} whiteSpace="normal">
                          {demande.libelleEtablissement}
                        </Td>
                        <Td minW={300} maxW={300} whiteSpace="normal">
                          {demande.libelleFiliere}
                        </Td>
                        <Td isNumeric>{demande.nbEtablissement}</Td>
                        <Td>{demande.libelleDepartement}</Td>
                        <Td isNumeric>
                          {demande.differenceCapaciteScolaire ?? 0}
                        </Td>
                        <Td isNumeric>
                          {demande.differenceCapaciteApprentissage ?? 0}
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
                        <Td isNumeric>
                          <GraphWrapper value={demande.pression} />
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
  );
};
