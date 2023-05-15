"use client";

import {
  Center,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { usePlausible } from "next-plausible";
import { Fragment, useState } from "react";
import { FORMATIONS_COLUMNS } from "shared";

import { api } from "@/api.client";
import { TableFooter } from "@/components/TableFooter";

import { Multiselect } from "../../../components/Multiselect";
import { OrderIcon } from "../../../components/OrderIcon";
import {
  FormationLineContent,
  FormationLineLoader,
  FormationLinePlaceholder,
} from "./components/LineContent";

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

export type Line = Awaited<
  ReturnType<ReturnType<typeof api.getFormations>["call"]>
>["formations"][number];

type LineId = {
  codeDispositif?: string;
  cfd: string;
};

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
    setPage(0);
    setFilters({ ...filters, [type]: value });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("formations:filtre", { props: { filter_name: filterName } });
  };

  const [historiqueId, setHistoriqueId] = useState<LineId>();

  const { data: historique, isFetching: isFetchingHistorique } = useQuery({
    keepPreviousData: false,
    staleTime: 10000000,
    queryKey: ["formations", historiqueId],
    enabled: !!historiqueId,
    queryFn: async () => {
      if (!historiqueId) return;
      return (
        await fetchFormations({
          ...filters,
          cfd: [historiqueId?.cfd],
          codeDispositif: historiqueId?.codeDispositif
            ? [historiqueId?.codeDispositif]
            : undefined,
          limit: 2,
          order: "desc",
          orderBy: "rentreeScolaire",
          rentreeScolaire: ["2021"],
          withEmptyFormations: false,
        })
      ).formations;
    },
  });

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
                <Th></Th>
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
                <Th>{FORMATIONS_COLUMNS.rentreeScolaire}</Th>
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
                  {FORMATIONS_COLUMNS.effectif1}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif2")}
                >
                  <OrderIcon {...order} column="effectif2" />
                  {FORMATIONS_COLUMNS.effectif2}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif3")}
                >
                  <OrderIcon {...order} column="effectif3" />
                  {FORMATIONS_COLUMNS.effectif3}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPression")}
                >
                  <OrderIcon {...order} column="tauxPression" />
                  {FORMATIONS_COLUMNS.tauxPression}
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
                  {FORMATIONS_COLUMNS.tauxInsertion12mois}
                </Th>
                <Th cursor="pointer">Delta régional insertion</Th>
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
                <Fragment
                  key={`${line.codeFormationDiplome}_${line.dispositifId}`}
                >
                  <Tr>
                    <FormationLineContent
                      defaultRentreeScolaire="2022"
                      line={line}
                      expended={
                        historiqueId?.cfd === line.codeFormationDiplome &&
                        historiqueId.codeDispositif === line.dispositifId
                      }
                      onClickExpend={() =>
                        setHistoriqueId({
                          cfd: line.codeFormationDiplome,
                          codeDispositif: line.dispositifId,
                        })
                      }
                      onClickCollapse={() => setHistoriqueId(undefined)}
                    />
                  </Tr>
                  {historiqueId?.cfd === line.codeFormationDiplome &&
                    historiqueId.codeDispositif === line.dispositifId && (
                      <>
                        {historique &&
                          historique.map((historiqueLine) => (
                            <Tr
                              key={`${historiqueLine.codeFormationDiplome}_${historiqueLine.dispositifId}`}
                              bg={"#f5f5f5"}
                            >
                              <FormationLineContent line={historiqueLine} />
                            </Tr>
                          ))}

                        {historique && !historique.length && (
                          <FormationLinePlaceholder />
                        )}

                        {isFetchingHistorique && <FormationLineLoader />}
                      </>
                    )}
                </Fragment>
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
