"use client";

import {
  Center,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { api } from "@/api.client";
import { TableFooter } from "@/components/TableFooter";

import { GraphWrapper } from "../../../components/GraphWrapper";
import { Multiselect } from "../../../components/Multiselect";
import { OrderIcon } from "../../../components/OrderIcon";

type Query = Parameters<typeof api.getFormations>[0]["query"];

type Filters = Pick<
  Query,
  | "cfd"
  | "cfdFamille"
  | "codeAcademie"
  | "codeDepartement"
  | "codeDiplome"
  | "codeDispositif"
  | "codeRegion"
  | "commune"
>;

type Order = Pick<Query, "order" | "orderBy">;

const PAGE_SIZE = 30;

const fetchFormations = async (query: Query) =>
  api.getFormations({ query }).call();

export default function Formations() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState<{
    orderBy?: Query["orderBy"];
    order?: Query["order"];
  }>({
    order: "asc",
  });

  const [filters, setFilters] = useState<Filters>({});

  const { data, isFetching } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["formations", page, order, filters],
    queryFn: () =>
      fetchFormations({
        ...filters,
        ...order,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
  });

  const handleOrder = (column: Order["orderBy"]) => {
    if (order?.orderBy !== column) {
      setOrder({ order: "desc", orderBy: column });
      return;
    }
    setOrder({
      order: order?.order === "asc" ? "desc" : "asc",
      orderBy: column,
    });
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    unstable_batchedUpdates(() => {
      setPage(0);
      setFilters({ ...filters, [type]: value });
    });
  };

  return (
    <>
      <Flex justify={"flex-end"} gap={3} wrap={"wrap"} py="3">
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("codeRegion", selected)}
          options={data?.filters.regions}
        >
          Région
        </Multiselect>
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("codeAcademie", selected)}
          options={data?.filters.academies}
        >
          Académie
        </Multiselect>
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("codeDepartement", selected)}
          options={data?.filters.departements}
        >
          Département
        </Multiselect>
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("commune", selected)}
          options={data?.filters.communes}
        >
          Commune
        </Multiselect>
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("codeDiplome", selected)}
          options={data?.filters.diplomes}
        >
          Diplôme
        </Multiselect>
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("codeDispositif", selected)}
          options={data?.filters.dispositifs}
        >
          Dispositif
        </Multiselect>
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("cfdFamille", selected)}
          options={data?.filters.familles}
        >
          Famille
        </Multiselect>{" "}
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("cfd", selected)}
          options={data?.filters.formations}
        >
          Formation
        </Multiselect>
      </Flex>

      <Flex direction="column" flex={1} position="relative" minH="0">
        {isFetching && (
          <Center
            height="100%"
            width="100%"
            position="absolute"
            bg="rgb(255,255,255,0.8)"
            zIndex="1"
          >
            <Spinner />
          </Center>
        )}
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
                <Th>Diplome</Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDiplome")}
                >
                  <OrderIcon {...order} column="libelleDiplome" />
                  Formation
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("nbEtablissement")}
                >
                  <OrderIcon {...order} column="nbEtablissement" />
                  Nb Etab
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif")}
                >
                  <OrderIcon {...order} column="effectif" />
                  Effectif
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxInsertion6mois")}
                >
                  <OrderIcon {...order} column="tauxInsertion6mois" />
                  Tx d'emploi 6 mois
                </Th>
                <Th isNumeric>Delta régional insertion</Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPoursuiteEtudes")}
                >
                  <OrderIcon {...order} column="tauxPoursuiteEtudes" />
                  Tx de poursuite d'études
                </Th>
                <Th isNumeric>Delta régional poursuite</Th>
                <Th>Dispositif</Th>
                <Th>Famille de métiers</Th>
                <Th>codeFormationDiplome</Th>
                <Th>Décrochage</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.formations.map((line) => (
                <Tr key={`${line.codeFormationDiplome}_${line.dispositifId}`}>
                  <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
                  <Td>{line.libelleDiplome ?? "-"}</Td>
                  <Td isNumeric>{line.nbEtablissement ?? "-"}</Td>
                  <Td isNumeric>{line.effectif ?? "-"}</Td>
                  <Td isNumeric>
                    <GraphWrapper value={line.tauxInsertion6mois} />
                  </Td>
                  <Td isNumeric>
                    <GraphWrapper centered value={line.deltaInsertion6mois} />
                  </Td>
                  <Td isNumeric>
                    <GraphWrapper value={line.tauxPoursuiteEtudes} />
                  </Td>
                  <Td isNumeric>
                    <GraphWrapper centered value={line.deltaPoursuiteEtudes} />
                  </Td>
                  <Td>{line.libelleDispositif ?? "-"}</Td>
                  <Td>{line.libelleOfficielFamille ?? "-"}</Td>
                  <Td>{line.codeFormationDiplome ?? "-"}</Td>
                  <Td>-</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
      <TableFooter
        downloadLink={
          api.getFormationsCsv({
            query: { ...filters, ...order },
          }).url
        }
        page={page}
        pageSize={PAGE_SIZE}
        count={data?.count}
        onPageChange={setPage}
      />
    </>
  );
}
