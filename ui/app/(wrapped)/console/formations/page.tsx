"use client";

import {
  Box,
  Center,
  Flex,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { Fragment, useContext, useEffect, useState } from "react";

import { client } from "@/api.client";
import { TauxPressionScale } from "@/app/(wrapped)/components/TauxPressionScale";
import { TableFooter } from "@/components/TableFooter";
import { TooltipIcon } from "@/components/TooltipIcon";

import { Multiselect } from "../../../../components/Multiselect";
import { OrderIcon } from "../../../../components/OrderIcon";
import { createParametrizedUrl } from "../../../../utils/createParametrizedUrl";
import { downloadCsv, ExportColumns } from "../../../../utils/downloadCsv";
import { CodeRegionFilterContext } from "../../../layoutClient";
import {
  FormationLineContent,
  FormationLineLoader,
  FormationLinePlaceholder,
} from "./components/LineContent";
import { Filters, LineId, Order } from "./types";

const PAGE_SIZE = 30;

const FORMATIONS_COLUMNS = {
  rentreeScolaire: "RS",
  libelleNiveauDiplome: "Diplôme",
  libelleDiplome: "Formation",
  nbEtablissement: "Nb Etab",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  libelleDispositif: "Dispositif",
  libelleOfficielFamille: "	Famille de métiers",
  codeFormationDiplome: "Code diplôme",
  CPC: "CPC",
  CPCSecteur: "CPCSecteur",
  CPCSousSecteur: "CPCSousSecteur",
  libelleFiliere: "Secteur d’activité",
  "continuum.libelle": "Diplôme historique",
  "continuum.cfd": "Code diplôme historique",
  positionQuadrant: "Position dans le quadrant",
  dispositifId: "Code dispositif",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/formations"]["formations"][number]
>;

export default function Formations() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

  const setSearchParams = (params: {
    filters?: typeof filters;
    order?: typeof order;
    page?: typeof page;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;

  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  useEffect(() => {
    if (codeRegionFilter != "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters });
    }
  }, []);

  const { data, isFetching } = client.ref("[GET]/formations").useQuery(
    {
      query: {
        ...order,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        ...filters,
      },
    },
    { keepPreviousData: true, staleTime: 10000000 }
  );

  const trackEvent = usePlausible();

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("formations:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({ order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const handleFiltersContext = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    if (type === "codeRegion" && value != null)
      setCodeRegionFilter(value[0] ?? "");
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    handleFiltersContext(type, value);
    setSearchParams({
      page: 0,
      filters: { ...filters, [type]: value },
    });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("formations:filtre", { props: { filter_name: filterName } });
  };

  const [historiqueId, setHistoriqueId] = useState<LineId>();

  const { data: historique, isFetching: isFetchingHistorique } = useQuery({
    keepPreviousData: false,
    staleTime: 10000000,
    queryKey: ["formations", historiqueId, filters],
    enabled: !!historiqueId,
    queryFn: async () => {
      if (!historiqueId) return;
      return (
        await client.ref("[GET]/formations").query({
          query: {
            ...filters,
            cfd: [historiqueId?.cfd],
            codeDispositif: historiqueId?.codeDispositif
              ? [historiqueId?.codeDispositif]
              : undefined,
            limit: 2,
            order: "desc",
            orderBy: "rentreeScolaire",
            rentreeScolaire: ["2021", "2020"],
            withEmptyFormations: false,
          },
        })
      ).formations;
    },
  });

  return (
    <>
      <Flex justify={"flex-end"} gap={3} wrap={"wrap"} py="3">
        <Select
          placeholder="Toutes les régions"
          width="12rem"
          variant="input"
          size="sm"
          onChange={(e) => {
            handleFiltersContext("codeRegion", [e.target.value]);
            setSearchParams({
              page: 0,
              filters: {
                ...filters,
                codeAcademie: undefined,
                codeDepartement: undefined,
                commune: undefined,
                codeRegion:
                  e.target.value === "" ? undefined : [e.target.value],
              },
            });
          }}
          value={filters.codeRegion?.[0] ?? ""}
        >
          {data?.filters.regions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Multiselect
          display={["none", null, "flex"]}
          disabled={!filters.codeRegion}
          onClose={filterTracker("codeAcademie")}
          width="12rem"
          onChange={(selected) => handleFilters("codeAcademie", selected)}
          options={data?.filters.academies}
          value={filters.codeAcademie ?? []}
        >
          Académie
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          disabled={!filters.codeRegion}
          onClose={filterTracker("codeDepartement")}
          width="12rem"
          onChange={(selected) => handleFilters("codeDepartement", selected)}
          options={data?.filters.departements}
          value={filters.codeDepartement ?? []}
        >
          Département
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          disabled={!filters.codeRegion}
          onClose={filterTracker("commune")}
          width="12rem"
          onChange={(selected) => handleFilters("commune", selected)}
          options={data?.filters.communes}
          value={filters.commune ?? []}
        >
          Commune
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("codeDiplome")}
          width="12rem"
          onChange={(selected) => handleFilters("codeDiplome", selected)}
          options={data?.filters.diplomes}
          value={filters.codeDiplome ?? []}
        >
          Diplôme
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("codeDispositif")}
          width="12rem"
          onChange={(selected) => handleFilters("codeDispositif", selected)}
          options={data?.filters.dispositifs}
          value={filters.codeDispositif ?? []}
        >
          Dispositif
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("cfdFamille")}
          width="12rem"
          onChange={(selected) => handleFilters("cfdFamille", selected)}
          options={data?.filters.familles}
          value={filters.cfdFamille ?? []}
        >
          Famille
        </Multiselect>
        <Multiselect
          onClose={filterTracker("cfd")}
          width="12rem"
          onChange={(selected) => handleFilters("cfd", selected)}
          options={data?.filters.formations}
          value={filters.cfd ?? []}
        >
          Formation
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("CPC")}
          width="12rem"
          onChange={(selected) => handleFilters("CPC", selected)}
          options={data?.filters.CPCs}
          value={filters.CPC ?? []}
        >
          CPC
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("CPCSecteur")}
          width="12rem"
          onChange={(selected) => handleFilters("CPCSecteur", selected)}
          options={data?.filters.CPCSecteurs}
          value={filters.CPCSecteur ?? []}
        >
          CPC Secteur
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("CPCSousSecteur")}
          width="12rem"
          onChange={(selected) => handleFilters("CPCSousSecteur", selected)}
          options={data?.filters.CPCSousSecteurs}
          value={filters.CPCSousSecteur ?? []}
        >
          CPC Sous Secteur
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("libelleFiliere")}
          width="12rem"
          onChange={(selected) => handleFilters("libelleFiliere", selected)}
          options={data?.filters.libelleFilieres}
          value={filters.libelleFiliere ?? []}
        >
          Secteur d’activité
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
                <Th />
                <Th>{FORMATIONS_COLUMNS.rentreeScolaire}</Th>
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
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif1")}
                >
                  <OrderIcon {...order} column="effectif1" />
                  {FORMATIONS_COLUMNS.effectif1}
                  <TooltipIcon ml="1" label="Nb d'élèves" />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif2")}
                >
                  <OrderIcon {...order} column="effectif2" />
                  {FORMATIONS_COLUMNS.effectif2}
                  <TooltipIcon ml="1" label="Nb d'élèves" />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif3")}
                >
                  <OrderIcon {...order} column="effectif3" />
                  {FORMATIONS_COLUMNS.effectif3}
                  <TooltipIcon ml="1" label="Nb d'élèves" />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPression")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxPression" />
                  {FORMATIONS_COLUMNS.tauxPression}
                  <TooltipIcon
                    ml="1"
                    label={
                      <>
                        <Box>
                          Le ratio entre le nombre de premiers voeux et la
                          capacité de la formation.
                        </Box>
                        <TauxPressionScale />
                      </>
                    }
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxRemplissage")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxRemplissage" />
                  {FORMATIONS_COLUMNS.tauxRemplissage}
                  <TooltipIcon
                    ml="1"
                    label="Le ratio entre l’effectif d’entrée en formation et sa capacité."
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxInsertion")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxInsertion" />
                  {FORMATIONS_COLUMNS.tauxInsertion}
                  <TooltipIcon
                    ml="1"
                    label="La part de ceux qui sont en emploi 6 mois après leur sortie d’étude."
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPoursuite")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxPoursuite" />
                  {FORMATIONS_COLUMNS.tauxPoursuite}
                  <TooltipIcon
                    ml="1"
                    label="Tout élève inscrit à N+1 (réorientation et redoublement compris)."
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxDevenirFavorable")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxDevenirFavorable" />
                  {FORMATIONS_COLUMNS.tauxDevenirFavorable}
                  <TooltipIcon
                    ml="1"
                    label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation"
                  />
                </Th>
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
                <Th cursor="pointer" onClick={() => handleOrder("CPC")}>
                  <OrderIcon {...order} column="CPC" />
                  {FORMATIONS_COLUMNS.CPC}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("CPCSecteur")}>
                  <OrderIcon {...order} column="CPCSecteur" />
                  {FORMATIONS_COLUMNS.CPCSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("CPCSousSecteur")}
                >
                  <OrderIcon {...order} column="CPCSousSecteur" />
                  {FORMATIONS_COLUMNS.CPCSousSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleFiliere")}
                >
                  <OrderIcon {...order} column="libelleFiliere" />
                  {FORMATIONS_COLUMNS.libelleFiliere}
                </Th>
                <Th>
                  {FORMATIONS_COLUMNS.positionQuadrant}
                  <TooltipIcon
                    ml="1"
                    label="Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux d'emploi et de poursuite d'études appliquées au niveau de diplôme."
                  />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.formations.map((line) => (
                <Fragment
                  key={`${line.codeFormationDiplome}_${line.dispositifId}`}
                >
                  <Tr h="12">
                    <FormationLineContent
                      filters={filters}
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
                              bg={"grey.975"}
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
        onExport={async () => {
          trackEvent("formations:export");
          const data = await client
            .ref("[GET]/formations")
            .query({ query: { ...filters, ...order, limit: 1000000 } });
          downloadCsv(
            "formations_export.csv",
            data.formations,
            FORMATIONS_COLUMNS
          );
        }}
        page={page}
        pageSize={PAGE_SIZE}
        count={data?.count}
        onPageChange={(newPage) => setSearchParams({ page: newPage })}
      />
    </>
  );
}
