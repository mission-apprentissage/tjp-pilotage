"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

import { Graph } from "../../../components/Graph";

type DATA = {
  id: string;
  codeFormationDiplome: string;
  libelleDiplome: string;
  libelleDispositif?: string;
  libelleOfficielFamille?: string;
  libelleNiveauDiplome: string;
  nbEtablissement: number;
  effectif: number;
  nbInsertion6mois: number;
  nbPoursuiteEtudes: number;
  nbSortants: number;
  effectifSortie: number;
};

const PAGE_SIZE = 30;

const fetchFormations = async ({
  offset,
  limit,
  order,
}: {
  offset?: number;
  limit?: number;
  order?: { order: "asc" | "desc"; orderBy: string };
}) =>
  (
    await axios.get("http://localhost/api/formations", {
      params: { offset, limit, ...order },
    })
  ).data as { count: number; formations: DATA[] };

const useFormations = ({
  page = 0,
  order,
}: {
  page: number;
  order?: { order: "asc" | "desc"; orderBy: string };
}) => {
  const [formations, setFormations] = useState<{
    count: number;
    formations: DATA[];
  }>();

  useEffect(() => {
    (async () => {
      const fetchedFormations = await fetchFormations({
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        order,
      });
      setFormations(fetchedFormations);
    })();
  }, [page, order]);
  return formations;
};

const GraphWrapper = ({ value }: { value: number }) => (
  <>
    {value !== undefined && !Number.isNaN(value) ? (
      <>
        {(value * 100).toFixed()}%{" "}
        <Graph
          value={value * 100}
          width="100px"
          display="inline-block"
          ml="2"
        />
      </>
    ) : (
      "-"
    )}
  </>
);

const OrderIcon = ({
  column,
  order,
}: {
  column: string;
  order?: {
    orderBy: string;
    order: "desc" | "asc";
  };
}) => {
  if (!order || order.orderBy !== column) return null;
  if (order.order === "desc") {
    return <ChevronDownIcon />;
  }
  return <ChevronUpIcon />;
};

export default function Home() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<{
    orderBy: string;
    order: "desc" | "asc";
  }>();

  const data = useFormations({ page, order });

  const handleOrder = (column: string) => {
    console.log(order?.orderBy !== column);
    if (order?.orderBy !== column) {
      setOrder({ order: "desc", orderBy: column });
      return;
    }
    setOrder({
      order: order?.order === "asc" ? "desc" : "asc",
      orderBy: column,
    });
  };

  if (!data) return <Center py="4">load</Center>;
  return (
    <>
      <TableContainer mt="4" overflowY="auto" flex={1}>
        <Table size={"sm"}>
          <Thead
            position="sticky"
            top="0"
            bg="white"
            boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
            zIndex={1}
          >
            <Tr>
              <Th>Libellé</Th>
              <Th>Diplome</Th>
              <Th isNumeric onClick={() => handleOrder("nbEtablissement")}>
                <OrderIcon order={order} column="nbEtablissement" />
                nb Etablissement
              </Th>
              <Th isNumeric onClick={() => handleOrder("effectif")}>
                <OrderIcon order={order} column="effectif" />
                effectif
              </Th>
              <Th>Tx d'emploi 6 mois</Th>
              <Th>Delta régional insertion</Th>
              <Th>Tx de poursuite d'études</Th>
              <Th>Delta régional poursuite</Th>
              <Th>Dispositif</Th>
              <Th>Famille de métiers</Th>
              <Th>code Formation Diplome</Th>
              <Th>Décrochage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.formations.map(
              ({
                libelleDiplome,
                codeFormationDiplome,
                effectif,
                nbEtablissement,
                libelleDispositif,
                nbInsertion6mois,
                libelleNiveauDiplome,
                nbSortants,
                nbPoursuiteEtudes,
                effectifSortie,
                libelleOfficielFamille,
              }) => (
                <Tr key={`${libelleDiplome}_${libelleDispositif}`}>
                  <Td>{libelleNiveauDiplome ?? "-"}</Td>
                  <Td>{libelleDiplome ?? "-"}</Td>
                  <Td isNumeric>{nbEtablissement ?? "-"}</Td>
                  <Td isNumeric>{effectif ?? "-"}</Td>
                  <Td>
                    <GraphWrapper value={nbInsertion6mois / nbSortants} />
                  </Td>
                  <Td>-</Td>
                  <Td>
                    <GraphWrapper value={nbPoursuiteEtudes / effectifSortie} />
                  </Td>
                  <Td>-</Td>
                  <Td>{libelleDispositif ?? "-"}</Td>
                  <Td>{libelleOfficielFamille ?? "-"}</Td>
                  <Td>{codeFormationDiplome ?? "-"}</Td>
                  <Td>-</Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex
        justify="flex-end"
        align="center"
        borderTop="1px solid"
        borderColor="grey.900"
        py="2"
      >
        <Box mr="4">
          {page * PAGE_SIZE} - {(page + 1) * PAGE_SIZE} sur {data.count}
        </Box>
        <IconButton
          isDisabled={page === 0}
          onClick={() => setPage(page - 1)}
          size="sm"
          aria-label="Page précédente"
          icon={<ArrowLeftIcon />}
        />
        <IconButton
          isDisabled={(page + 1) * PAGE_SIZE >= data.count}
          onClick={() => setPage(page + 1)}
          ml="2"
          size="sm"
          aria-label="Page suivante"
          icon={<ArrowRightIcon />}
        />
      </Flex>
    </>
  );
}
