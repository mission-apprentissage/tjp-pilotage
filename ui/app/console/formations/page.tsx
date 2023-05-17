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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { usePlausible } from "next-plausible";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { FORMATIONS_COLUMNS } from "shared";

import { api } from "@/api.client";
import { TauxPressionScale } from "@/app/components/TauxPressionScale";
import { TableFooter } from "@/components/TableFooter";

import { GraphWrapper } from "../../../components/GraphWrapper";
import { Multiselect } from "../../../components/Multiselect";
import { OrderIcon } from "../../../components/OrderIcon";
import { getTauxPressionStyle } from "../../../utils/getBgScale";

type Query = Parameters<typeof api.getFormations>[0]["query"];

type Filters = Pick<
  Query,
  | "cfd"
  | "cfdFamille"
  | "codeAcademie"
  | "codeDepartement"
  | "codeDiplome"
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

  const trackEvent = usePlausible();

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("formations:ordre", { props: { colonne: column } });
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
    trackEvent("formations:filtre", { props: { filter_name: filterName } });
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
        </Multiselect>{" "}
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
                <Tooltip label="Rentrée scolaire">RS</Tooltip>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("codeNiveauDiplome")}
                >
                  <OrderIcon {...order} column="codeNiveauDiplome" />
                  {FORMATIONS_COLUMNS.libelleNiveauDiplome}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDiplome")}
                >
                  <OrderIcon {...order} column="libelleDiplome" />
                  {FORMATIONS_COLUMNS.libelleDiplome}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("nbEtablissement")}
                >
                  <OrderIcon {...order} column="nbEtablissement" />
                  {FORMATIONS_COLUMNS.nbEtablissement}
                </Th>
                <Th
                  display="flex"
                  align="center"
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif1")}
                >
                  <OrderIcon {...order} column="effectif1" />
                  <Tooltip label="Nb d'élèves">
                    {FORMATIONS_COLUMNS.effectif1}
                  </Tooltip>
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif2")}
                >
                  <OrderIcon {...order} column="effectif2" />
                  <Tooltip label="Nb d'élèves">
                    {FORMATIONS_COLUMNS.effectif2}
                  </Tooltip>
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif3")}
                >
                  <OrderIcon {...order} column="effectif3" />
                  <Tooltip label="Nb d'élèves">
                    {FORMATIONS_COLUMNS.effectif3}
                  </Tooltip>
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPression")}
                >
                  <OrderIcon {...order} column="tauxPression" />
                  <Tooltip label={<TauxPressionScale />}>
                    {FORMATIONS_COLUMNS.tauxPression}
                  </Tooltip>
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxRemplissage")}
                >
                  <OrderIcon {...order} column="tauxRemplissage" />
                  {FORMATIONS_COLUMNS.tauxRemplissage}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxInsertion12mois")}
                >
                  <OrderIcon {...order} column="tauxInsertion12mois" />
                  <Tooltip label="Cohorte 2020_2021">
                    {FORMATIONS_COLUMNS.tauxInsertion12mois}
                  </Tooltip>
                </Th>
                <Th cursor="pointer">
                  <Tooltip
                    label={
                      <>
                        Ecart / la moyenne de la totalité des bac pro. <br />
                        Exemple: le delta permet de savoir comment se situe le
                        BAC PRO Cusine en terme de niveau d'insertion par
                        rapport à la moyenne des BAC PRO dans la région.
                      </>
                    }
                  >
                    {FORMATIONS_COLUMNS.deltaInsertion12mois}
                  </Tooltip>
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPoursuiteEtudes")}
                >
                  <OrderIcon {...order} column="tauxPoursuiteEtudes" />
                  {FORMATIONS_COLUMNS.tauxPoursuiteEtudes}
                </Th>
                <Th isNumeric>{FORMATIONS_COLUMNS.deltaPoursuiteEtudes}</Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDispositif")}
                >
                  <OrderIcon {...order} column="libelleDispositif" />
                  {FORMATIONS_COLUMNS.libelleDispositif}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleOfficielFamille")}
                >
                  <OrderIcon {...order} column="libelleOfficielFamille" />
                  {FORMATIONS_COLUMNS.libelleOfficielFamille}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("codeFormationDiplome")}
                >
                  <OrderIcon {...order} column="codeFormationDiplome" />
                  {FORMATIONS_COLUMNS.codeFormationDiplome}
                </Th>
                <Th>{FORMATIONS_COLUMNS.decrochage}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.formations.map((line) => (
                <Tr key={`${line.codeFormationDiplome}_${line.dispositifId}`}>
                  <Td>2022</Td>
                  <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
                  <Td>{line.libelleDiplome ?? "-"}</Td>
                  <Td isNumeric>{line.nbEtablissement ?? "-"}</Td>
                  <Td isNumeric>{line.effectif1 ?? "-"}</Td>
                  <Td isNumeric>{line.effectif2 ?? "-"}</Td>
                  <Td isNumeric>{line.effectif3 ?? "-"}</Td>
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
                    <GraphWrapper value={line.tauxInsertion12mois} />
                  </Td>
                  <Td isNumeric>
                    <GraphWrapper centered value={line.deltaInsertion12mois} />
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
        onExport={() => trackEvent("formations:export")}
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
