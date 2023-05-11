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
import { usePlausible } from "next-plausible";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { ETABLISSEMENTS_COLUMNS } from "shared";

import { api } from "@/api.client";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { GraphWrapper } from "../../../components/GraphWrapper";
import { Multiselect } from "../../../components/Multiselect";

type Query = Parameters<typeof api.getEtablissements>[0]["query"];

type Filters = Pick<
  Query,
  | "cfd"
  | "cfdFamille"
  | "codeAcademie"
  | "codeDepartement"
  | "codeDiplome"
  | "codeRegion"
  | "commune"
  | "uai"
  | "secteur"
>;

type Order = Pick<Query, "order" | "orderBy">;

const PAGE_SIZE = 30;

const fetchEtablissements = async (query: Query) =>
  api.getEtablissements({ query }).call();

export default function Etablissements() {
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

  const trackEvent = usePlausible();
  const handleOrder = (column: Exclude<Order["orderBy"], undefined>) => {
    trackEvent("etablissements:ordre", { props: { colonne: column } });

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

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("etablissements:filtre", { props: { filter_name: filterName } });
  };

  return (
    <>
      <Flex justify={"flex-end"} gap={3} wrap={"wrap"} py="3">
        <Multiselect
          onClose={filterTracker("codeRegion")}
          width="52"
          onChange={(selected) => handleFilters("codeRegion", selected)}
          options={data?.filters.regions}
        >
          Région
        </Multiselect>
        <Multiselect
          onClose={filterTracker("codeAcademie")}
          width="52"
          onChange={(selected) => handleFilters("codeAcademie", selected)}
          options={data?.filters.academies}
        >
          Académie
        </Multiselect>
        <Multiselect
          onClose={filterTracker("codeDepartement")}
          width="52"
          onChange={(selected) => handleFilters("codeDepartement", selected)}
          options={data?.filters.departements}
        >
          Département
        </Multiselect>
        <Multiselect
          onClose={filterTracker("commune")}
          width="52"
          onChange={(selected) => handleFilters("commune", selected)}
          options={data?.filters.communes}
        >
          Commune
        </Multiselect>
        <Multiselect
          onClose={filterTracker("uai")}
          width="52"
          onChange={(selected) => handleFilters("uai", selected)}
          options={data?.filters.etablissements}
        >
          Etablissement
        </Multiselect>
        <Multiselect
          onClose={filterTracker("secteur")}
          width="52"
          onChange={(selected) => handleFilters("secteur", selected)}
          options={[
            { label: "PR", value: "PR" },
            { label: "PU", value: "PU" },
          ]}
        >
          Secteur
        </Multiselect>
        <Multiselect
          onClose={filterTracker("codeDiplome")}
          width="52"
          onChange={(selected) => handleFilters("codeDiplome", selected)}
          options={data?.filters.diplomes}
        >
          Diplôme
        </Multiselect>
        <Multiselect
          onClose={filterTracker("cfdFamille")}
          width="52"
          onChange={(selected) => handleFilters("cfdFamille", selected)}
          options={data?.filters.familles}
        >
          Famille
        </Multiselect>
        <Multiselect
          onClose={filterTracker("cfd")}
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
        <TableContainer overflowY="auto">
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
                  onClick={() => handleOrder("libelleEtablissement")}
                >
                  <OrderIcon {...order} column="libelleEtablissement" />
                  {ETABLISSEMENTS_COLUMNS.libelleEtablissement}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("commune")}>
                  <OrderIcon {...order} column="commune" />
                  {ETABLISSEMENTS_COLUMNS.commune}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("departement")}>
                  <OrderIcon {...order} column="departement" />
                  {ETABLISSEMENTS_COLUMNS.departement}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleNiveauDiplome")}
                >
                  <OrderIcon {...order} column="libelleNiveauDiplome" />
                  {ETABLISSEMENTS_COLUMNS.libelleNiveauDiplome}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDiplome")}
                >
                  <OrderIcon {...order} column="libelleDiplome" />
                  {ETABLISSEMENTS_COLUMNS.libelleDiplome}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif1")}
                >
                  <OrderIcon {...order} column="effectif1" />
                  {ETABLISSEMENTS_COLUMNS.effectif1}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif2")}
                >
                  <OrderIcon {...order} column="effectif2" />
                  {ETABLISSEMENTS_COLUMNS.effectif2}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif3")}
                >
                  <OrderIcon {...order} column="effectif3" />
                  {ETABLISSEMENTS_COLUMNS.effectif3}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("capacite")}
                >
                  <OrderIcon {...order} column="capacite" />
                  {ETABLISSEMENTS_COLUMNS.capacite}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPression")}
                >
                  <OrderIcon {...order} column="tauxPression" />
                  {ETABLISSEMENTS_COLUMNS.tauxPression}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxRemplissage")}
                >
                  <OrderIcon {...order} column="tauxRemplissage" />
                  {ETABLISSEMENTS_COLUMNS.tauxRemplissage}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPoursuiteEtudes")}
                >
                  <OrderIcon {...order} column="tauxPoursuiteEtudes" />
                  {ETABLISSEMENTS_COLUMNS.tauxPoursuiteEtudes}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("valeurAjoutee")}
                >
                  <OrderIcon {...order} column="valeurAjoutee" />
                  {ETABLISSEMENTS_COLUMNS.valeurAjoutee}
                </Th>
                <Th isNumeric>{ETABLISSEMENTS_COLUMNS.decrochage}</Th>
                <Th cursor="pointer" onClick={() => handleOrder("secteur")}>
                  <OrderIcon {...order} column="secteur" />
                  {ETABLISSEMENTS_COLUMNS.secteur}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("UAI")}>
                  <OrderIcon {...order} column="UAI" />
                  {ETABLISSEMENTS_COLUMNS.UAI}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDispositif")}
                >
                  <OrderIcon {...order} column="libelleDispositif" />
                  {ETABLISSEMENTS_COLUMNS.libelleDispositif}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleOfficielFamille")}
                >
                  <OrderIcon {...order} column="libelleOfficielFamille" />
                  {ETABLISSEMENTS_COLUMNS.libelleOfficielFamille}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.etablissements.map((line) => (
                <Tr
                  key={`${line.UAI}_${line.dispositifId}_${line.codeFormationDiplome}`}
                >
                  <Td>{line.libelleEtablissement ?? "-"}</Td>
                  <Td>{line.commune ?? "-"}</Td>
                  <Td>{line.departement ?? "-"}</Td>
                  <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
                  <Td>{line.libelleDiplome ?? "-"}</Td>

                  <Td isNumeric>{line.effectif1 ?? "-"}</Td>
                  <Td isNumeric>{line.effectif2 ?? "-"}</Td>
                  <Td isNumeric>{line.effectif3 ?? "-"}</Td>
                  <Td isNumeric>{line.capacite ?? "-"}</Td>
                  <Td
                    style={{
                      ...getTauxPressionStyle(
                        line.tauxPression !== undefined
                          ? line.tauxPression / 100
                          : undefined
                      ),
                    }}
                    isNumeric
                  >
                    {line.tauxPression !== undefined
                      ? line.tauxPression / 100
                      : "-"}
                  </Td>
                  <Td isNumeric>
                    <GraphWrapper value={line.tauxRemplissage} />
                  </Td>
                  <Td isNumeric>
                    <GraphWrapper value={line.tauxPoursuiteEtudes} />
                  </Td>
                  <Td isNumeric>{line.valeurAjoutee ?? "-"} </Td>
                  <Td isNumeric>-</Td>
                  <Td>{line.secteur ?? "-"} </Td>
                  <Td>{line.UAI ?? "-"} </Td>
                  <Td>{line.libelleDispositif ?? "-"}</Td>
                  <Td>{line.libelleOfficielFamille ?? "-"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
      <TableFooter
        onExport={() => trackEvent("etablissements:export")}
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
  );
}
