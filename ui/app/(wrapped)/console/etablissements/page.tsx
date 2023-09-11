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
import { unstable_batchedUpdates } from "react-dom";
import { ETABLISSEMENTS_COLUMNS } from "shared";

import { api } from "@/api.client";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { Multiselect } from "../../../../components/Multiselect";
import { TooltipIcon } from "../../../../components/TooltipIcon";
import { TauxPressionScale } from "../../../_components/TauxPressionScale";
import {
  CodeRegionFilterContext,
  UaiFilterContext,
} from "../../../layoutClient";
import {
  EtablissementLineContent,
  EtablissementLineLoader,
  EtablissementLinePlaceholder,
} from "./components/LineContent";

type Query = Parameters<typeof api.getEtablissements>[0]["query"];

export type Line = Awaited<
  ReturnType<ReturnType<typeof api.getEtablissements>["call"]>
>["etablissements"][number];

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
  | "CPC"
  | "CPCSecteur"
  | "CPCSousSecteur"
  | "libelleFiliere"
  | "codeDispositif"
>;

type Order = Pick<Query, "order" | "orderBy">;

type LineId = {
  codeDispositif?: string;
  cfd: string;
  UAI: string;
};

const PAGE_SIZE = 30;

const fetchEtablissements = async (query: Query) =>
  api.getEtablissements({ query }).call();

export default function Etablissements() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString());
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

  const { uaiFilter, setUaiFilter } = useContext(UaiFilterContext);

  useEffect(() => {
    if (codeRegionFilter != "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters });
    }
    if (uaiFilter != "") {
      filters.uai = [uaiFilter];
      setSearchParams({ filters: filters });
    }
  }, []);

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
    if (type === "uai" && value != null) setUaiFilter(value[0] ?? "");
    if (type === "codeRegion" && value != null)
      setCodeRegionFilter(value[0] ?? "");
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    handleFiltersContext(type, value);
    unstable_batchedUpdates(() => {
      setSearchParams({
        page: 0,
        filters: { ...filters, [type]: value },
      });
    });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("etablissements:filtre", { props: { filter_name: filterName } });
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
        await fetchEtablissements({
          ...filters,
          cfd: [historiqueId?.cfd],
          codeDispositif: historiqueId?.codeDispositif
            ? [historiqueId?.codeDispositif]
            : undefined,
          uai: [historiqueId.UAI],
          limit: 2,
          order: "desc",
          orderBy: "rentreeScolaire",
          rentreeScolaire: ["2021", "2020"],
        })
      ).etablissements;
    },
  });

  return (
    <>
      <Flex justify={"flex-end"} gap={3} wrap={"wrap"} py="3">
        <Select
          placeholder="Toutes les régions"
          width="52"
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
          disabled={!filters.codeRegion}
          onClose={filterTracker("codeAcademie")}
          width="52"
          onChange={(selected) => handleFilters("codeAcademie", selected)}
          options={data?.filters.academies}
          value={filters.codeAcademie ?? []}
        >
          Académie
        </Multiselect>
        <Multiselect
          disabled={!filters.codeRegion}
          onClose={filterTracker("codeDepartement")}
          width="52"
          onChange={(selected) => handleFilters("codeDepartement", selected)}
          options={data?.filters.departements}
          value={filters.codeDepartement ?? []}
        >
          Département
        </Multiselect>
        <Multiselect
          disabled={!filters.codeRegion}
          onClose={filterTracker("commune")}
          width="52"
          onChange={(selected) => handleFilters("commune", selected)}
          options={data?.filters.communes}
          value={filters.commune ?? []}
        >
          Commune
        </Multiselect>
        <Multiselect
          onClose={filterTracker("uai")}
          width="52"
          onChange={(selected) => handleFilters("uai", selected)}
          options={data?.filters.etablissements}
          value={filters.uai ?? []}
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
          value={filters.secteur ?? []}
        >
          Secteur
        </Multiselect>
        <Multiselect
          onClose={filterTracker("codeDiplome")}
          width="52"
          onChange={(selected) => handleFilters("codeDiplome", selected)}
          options={data?.filters.diplomes}
          value={filters.codeDiplome ?? []}
        >
          Diplôme
        </Multiselect>
        <Multiselect
          onClose={filterTracker("codeDispositif")}
          width="52"
          onChange={(selected) => handleFilters("codeDispositif", selected)}
          options={data?.filters.dispositifs}
          value={filters.codeDispositif ?? []}
        >
          Dispositif
        </Multiselect>
        <Multiselect
          onClose={filterTracker("cfdFamille")}
          width="52"
          onChange={(selected) => handleFilters("cfdFamille", selected)}
          options={data?.filters.familles}
          value={filters.cfdFamille ?? []}
        >
          Famille
        </Multiselect>
        <Multiselect
          onClose={filterTracker("cfd")}
          width="52"
          onChange={(selected) => handleFilters("cfd", selected)}
          options={data?.filters.formations}
          value={filters.cfd ?? []}
        >
          Formation
        </Multiselect>
        <Multiselect
          onClose={filterTracker("CPC")}
          width="52"
          onChange={(selected) => handleFilters("CPC", selected)}
          options={data?.filters.CPCs}
          value={filters.CPC ?? []}
        >
          CPC
        </Multiselect>
        <Multiselect
          onClose={filterTracker("CPCSecteur")}
          width="52"
          onChange={(selected) => handleFilters("CPCSecteur", selected)}
          options={data?.filters.CPCSecteurs}
          value={filters.CPCSecteur ?? []}
        >
          CPC Secteur
        </Multiselect>
        <Multiselect
          onClose={filterTracker("CPCSousSecteur")}
          width="52"
          onChange={(selected) => handleFilters("CPCSousSecteur", selected)}
          options={data?.filters.CPCSousSecteurs}
          value={filters.CPCSousSecteur ?? []}
        >
          CPC Sous Secteur
        </Multiselect>
        <Multiselect
          onClose={filterTracker("libelleFiliere")}
          width="52"
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
                <Th />
                <Th>{ETABLISSEMENTS_COLUMNS.rentreeScolaire}</Th>
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
                  <TooltipIcon ml="1" label="Nb d'élèves" />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif2")}
                >
                  <OrderIcon {...order} column="effectif2" />
                  {ETABLISSEMENTS_COLUMNS.effectif2}
                  <TooltipIcon ml="1" label="Nb d'élèves" />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif3")}
                >
                  <OrderIcon {...order} column="effectif3" />
                  {ETABLISSEMENTS_COLUMNS.effectif3}
                  <TooltipIcon ml="1" label="Nb d'élèves" />
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
                  <TooltipIcon
                    ml="1"
                    label={
                      <>
                        <Box>
                          Le ratio entre le nombre de premiers voeux et la
                          capacité de la l'offre de formation.
                        </Box>
                        <TauxPressionScale />
                      </>
                    }
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxRemplissage")}
                >
                  <OrderIcon {...order} column="tauxRemplissage" />
                  {ETABLISSEMENTS_COLUMNS.tauxRemplissage}
                  <TooltipIcon
                    ml="1"
                    label="Le ratio entre l’effectif d’entrée en formation et sa capacité."
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxInsertion6mois")}
                >
                  <OrderIcon {...order} column="tauxInsertion6mois" />
                  {ETABLISSEMENTS_COLUMNS.tauxInsertion6mois}
                  <TooltipIcon
                    ml="1"
                    label="La part de ceux qui sont en emploi 6 mois après leur sortie d’étude."
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPoursuiteEtudes")}
                >
                  <OrderIcon {...order} column="tauxPoursuiteEtudes" />
                  {ETABLISSEMENTS_COLUMNS.tauxPoursuiteEtudes}
                  <TooltipIcon
                    ml="1"
                    label="Tout élève inscrit à N+1 (réorientation et redoublement compris)."
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("valeurAjoutee")}
                >
                  <OrderIcon {...order} column="valeurAjoutee" />
                  {ETABLISSEMENTS_COLUMNS.valeurAjoutee}
                  <TooltipIcon
                    ml="1"
                    label="Capacité de l'établissement à insérer, en prenant en compte le profil social des élèves et le taux de chômage de la zone d'emploi, comparativement au taux de référence d’établissements similaires."
                  />
                </Th>
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
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("codeFormationDiplome")}
                >
                  <OrderIcon {...order} column="codeFormationDiplome" />
                  {ETABLISSEMENTS_COLUMNS.codeFormationDiplome}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("CPC")}>
                  <OrderIcon {...order} column="CPC" />
                  {ETABLISSEMENTS_COLUMNS.CPC}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("CPCSecteur")}>
                  <OrderIcon {...order} column="CPCSecteur" />
                  {ETABLISSEMENTS_COLUMNS.CPCSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("CPCSousSecteur")}
                >
                  <OrderIcon {...order} column="CPCSousSecteur" />
                  {ETABLISSEMENTS_COLUMNS.CPCSousSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleFiliere")}
                >
                  <OrderIcon {...order} column="libelleFiliere" />
                  {ETABLISSEMENTS_COLUMNS.libelleFiliere}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.etablissements.map((line) => (
                <Fragment
                  key={`${line.UAI}_${line.dispositifId}_${line.codeFormationDiplome}`}
                >
                  <Tr>
                    <EtablissementLineContent
                      line={line}
                      defaultRentreeScolaire="2022"
                      expended={
                        historiqueId?.cfd === line.codeFormationDiplome &&
                        historiqueId.codeDispositif === line.dispositifId &&
                        historiqueId.UAI === line.UAI
                      }
                      onClickExpend={() =>
                        setHistoriqueId({
                          cfd: line.codeFormationDiplome,
                          codeDispositif: line.dispositifId,
                          UAI: line.UAI,
                        })
                      }
                      onClickCollapse={() => setHistoriqueId(undefined)}
                    />
                  </Tr>
                  {historiqueId?.cfd === line.codeFormationDiplome &&
                    historiqueId.codeDispositif === line.dispositifId &&
                    historiqueId.UAI === line.UAI && (
                      <>
                        {historique &&
                          historique.map((historiqueLine) => (
                            <Tr
                              key={`${historiqueLine.codeFormationDiplome}_${historiqueLine.dispositifId}`}
                              bg={"#f5f5f5"}
                            >
                              <EtablissementLineContent line={historiqueLine} />
                            </Tr>
                          ))}

                        {historique && !historique.length && (
                          <EtablissementLinePlaceholder />
                        )}

                        {isFetchingHistorique && <EtablissementLineLoader />}
                      </>
                    )}
                </Fragment>
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
        onPageChange={(newPage) => setSearchParams({ page: newPage })}
      />
    </>
  );
}
