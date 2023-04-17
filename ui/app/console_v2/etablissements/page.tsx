/* eslint-disable unused-imports/no-unused-vars */
//@ts-nocheck

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
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { api } from "@/api.client";
import { TableFooter } from "@/components/TableFooter";

import { GraphWrapper } from "../../../components/GraphWrapper";
import { Multiselect } from "../../../components/Multiselect";

type Query = Awaited<Parameters<typeof api.getEtablissements.call>[0]["query"]>;

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
  | "uai"
>;

const PAGE_SIZE = 30;

const fetchEtablissements = async (query: Query) =>
  api.getEtablissements({ query }).call();

export default function Etablissements() {
  const [page, setPage] = useState(0);

  //@ts-ignore
  const [order, setOrder] = useState<{
    orderBy?: Query["orderBy"];
    order?: Query["order"];
  }>({
    order: "asc",
  });

  const params = useSearchParams();

  const [filters, setFilters] = useState<Filters>(new Map());

  const { data, isFetching } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["etablissements", page, order, filters],
    queryFn: () => {
      return fetchEtablissements({
        ...filters,
        ...order,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
    },
  });

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
          onChange={(selected) => handleFilters("cfd", selected)}
          options={data?.filters.formations}
        >
          Formation
        </Multiselect>
        <Multiselect
          width="52"
          onChange={(selected) => handleFilters("cfdFamille", selected)}
          options={data?.filters.familles}
        >
          Famille
        </Multiselect>
      </Flex>

      <>
        <TableContainer overflowY="auto" flex={1} position="relative">
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
          <Table variant="simple" size={"sm"}>
            <Thead
              position="sticky"
              top="0"
              bg="white"
              boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
              zIndex={1}
            >
              <Tr>
                <Th>Nom d'établissement</Th>
                <Th>Commune</Th>
                <Th>Diplome</Th>
                <Th>Formation</Th>
                <Th isNumeric>Capacité</Th>
                <Th isNumeric>Effectif</Th>
                <Th isNumeric>Tx Remplissage</Th>
                <Th isNumeric>Tx Pression</Th>
                <Th isNumeric>Tx Poursuite d'études</Th>
                <Th isNumeric>Valeur ajoutée</Th>
                <Th isNumeric>Décrochage</Th>
                <Th isNumeric>Secteur</Th>
                <Th isNumeric>UAI</Th>
                <Th>Dispositif</Th>
                <Th>Famille de métier</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.etablissements.map((line) => (
                <Tr
                  key={`${line.libelleEtablissement}_${line.libelleDispositif}_${line.codeFormationDiplome}`}
                >
                  <Td>{line.libelleEtablissement ?? "-"}</Td>
                  <Td>{line.commune ?? "-"}</Td>
                  <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
                  <Td>{line.libelleDiplome ?? "-"}</Td>
                  <Td isNumeric>{line.capacite ?? "-"}</Td>
                  <Td isNumeric>{line.effectif ?? "-"}</Td>
                  <Td isNumeric>
                    <GraphWrapper value={line.tauxRemplissage} />
                  </Td>
                  <Td>-</Td>
                  <Td isNumeric>-</Td>
                  <Td isNumeric>-</Td>
                  <Td isNumeric>-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                  <Td>{line.libelleDispositif ?? "-"}</Td>
                  <Td>{line.libelleOfficielFamille ?? "-"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <TableFooter
          downloadLink={
            api.getEtablissementsCsv({
              query: { ...filters, ...order },
            }).url
          }
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={setPage}
        />
      </>
    </>
  );
}
