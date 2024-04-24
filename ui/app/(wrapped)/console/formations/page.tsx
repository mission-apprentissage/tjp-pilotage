"use client";

import {
  Box,
  Center,
  Checkbox,
  Flex,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { Fragment, useContext, useEffect, useState } from "react";
import { CURRENT_RENTREE, RENTREES_SCOLAIRES } from "shared";

import { client } from "@/api.client";
import { TauxPressionScale } from "@/app/(wrapped)/components/TauxPressionScale";
import { Multiselect } from "@/components/Multiselect";
import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

import { TableHeader } from "../../../../components/TableHeader";
import { CodeRegionFilterContext } from "../../../layoutClient";
import { useGlossaireContext } from "../../glossaire/glossaireContext";
import {
  FormationLineContent,
  FormationLineLoader,
  FormationLinePlaceholder,
} from "./components/LineContent";
import { FORMATION_COLUMNS } from "./FORMATION_COLUMNS";
import { Filters, LineId, Order } from "./types";

const PAGE_SIZE = 30;
const EXPORT_LIMIT = 1_000_000;

export default function Formations() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

  const setSearchParams = (params: {
    filters?: typeof filters;
    withAnneeCommune?: typeof withAnneeCommune;
    order?: typeof order;
    page?: typeof page;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const filters = searchParams.filters ?? {};
  const withAnneeCommune = searchParams.withAnneeCommune ?? "true";
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;

  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  useEffect(() => {
    if (codeRegionFilter !== "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  const getFormationsQueryParameters = (qLimit: number, qOffset?: number) => ({
    ...filters,
    ...order,
    offset: qOffset,
    limit: qLimit,
    withAnneeCommune: withAnneeCommune?.toString() ?? "true",
  });

  const { data, isFetching } = client.ref("[GET]/formations").useQuery(
    {
      query: getFormationsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    { staleTime: 10000000, keepPreviousData: true }
  );

  const trackEvent = usePlausible();

  const { openGlossaire } = useGlossaireContext();

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
      setCodeRegionFilter((value as string[])[0] ?? "");
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    handleFiltersContext(type, value);
    setSearchParams({
      page: 0,
      filters: { ...filters, [type]: value },
      withAnneeCommune,
    });
  };

  const handleToggleShowAnneeCommune = (value: string) => {
    setSearchParams({
      withAnneeCommune: value,
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
            rentreeScolaire: RENTREES_SCOLAIRES.filter(
              (rentree) => rentree !== CURRENT_RENTREE
            ),
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
          width="12rem"
          onClose={filterTracker("cpc")}
          onChange={(selected) => handleFilters("cpc", selected)}
          options={data?.filters.cpcs}
          value={filters.cpc ?? []}
        >
          CPC
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          onClose={filterTracker("codeNsf")}
          width="12rem"
          onChange={(selected) => handleFilters("codeNsf", selected)}
          options={data?.filters.libellesNsf}
          value={filters.codeNsf ?? []}
        >
          Domaine de formation (NSF)
        </Multiselect>
        <Flex w="24rem" mr="3">
          <Checkbox
            size="lg"
            variant="accessible"
            onChange={(event) => {
              handleToggleShowAnneeCommune(
                event.target.checked.toString() ?? "false"
              );
            }}
            isChecked={searchParams.withAnneeCommune === "false" ? false : true}
            whiteSpace={"nowrap"}
          >
            <Text fontSize={"14px"}>
              Afficher les secondes et premières communes
            </Text>
          </Checkbox>
        </Flex>
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
        <TableHeader
          onExportCsv={async () => {
            trackEvent("formations:export");
            const data = await client.ref("[GET]/formations").query({
              query: getFormationsQueryParameters(EXPORT_LIMIT),
            });
            downloadCsv(
              "formations_export",
              data.formations,
              FORMATION_COLUMNS
            );
          }}
          onExportExcel={async () => {
            const data = await client.ref("[GET]/formations").query({
              query: getFormationsQueryParameters(EXPORT_LIMIT),
            });
            trackEvent("formations:export-excel");
            downloadExcel(
              "formations_export",
              data.formations,
              FORMATION_COLUMNS
            );
          }}
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
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
                <Th>{FORMATION_COLUMNS.rentreeScolaire}</Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("codeNiveauDiplome")}
                >
                  <OrderIcon {...order} column="codeNiveauDiplome" />
                  {FORMATION_COLUMNS.libelleNiveauDiplome}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleFormation")}
                >
                  <OrderIcon {...order} column="libelleFormation" />
                  {FORMATION_COLUMNS.libelleFormation}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("nbEtablissement")}
                >
                  <OrderIcon {...order} column="nbEtablissement" />
                  {FORMATION_COLUMNS.nbEtablissement}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif1")}
                >
                  <OrderIcon {...order} column="effectif1" />
                  {FORMATION_COLUMNS.effectif1}
                  <TooltipIcon
                    ml="1"
                    label="Nb d'élèves"
                    onClick={() => openGlossaire("effectifs")}
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif2")}
                >
                  <OrderIcon {...order} column="effectif2" />
                  {FORMATION_COLUMNS.effectif2}
                  <TooltipIcon
                    ml="1"
                    label="Nb d'élèves"
                    onClick={() => openGlossaire("effectifs")}
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif3")}
                >
                  <OrderIcon {...order} column="effectif3" />
                  {FORMATION_COLUMNS.effectif3}
                  <TooltipIcon
                    ml="1"
                    label="Nb d'élèves"
                    onClick={() => openGlossaire("effectifs")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPression")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxPression" />
                  {FORMATION_COLUMNS.tauxPression}
                  <TooltipIcon
                    ml="1"
                    label={
                      <Box>
                        <Text>
                          Le ratio entre le nombre de premiers voeux et la
                          capacité de la formation au niveau régional.
                        </Text>
                        <Text>Cliquez pour plus d'infos.</Text>
                        <TauxPressionScale />
                      </Box>
                    }
                    onClick={() => openGlossaire("taux-de-pression")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxRemplissage")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxRemplissage" />
                  {FORMATION_COLUMNS.tauxRemplissage}
                  <TooltipIcon
                    ml="1"
                    label={
                      <Box>
                        <Text>
                          Le ratio entre l’effectif d’entrée en formation et sa
                          capacité.
                        </Text>
                        <Text>Cliquez pour plus d'infos.</Text>
                      </Box>
                    }
                    onClick={() => openGlossaire("taux-de-remplissage")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxInsertion")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxInsertion" />
                  {FORMATION_COLUMNS.tauxInsertion}
                  <TooltipIcon
                    ml="1"
                    label={
                      <Box>
                        <Text>
                          La part de ceux qui sont en emploi 6 mois après leur
                          sortie d’étude.
                        </Text>
                        <Text>Cliquez pour plus d'infos.</Text>
                      </Box>
                    }
                    onClick={() => openGlossaire("taux-emploi-6-mois")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPoursuite")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxPoursuite" />
                  {FORMATION_COLUMNS.tauxPoursuite}
                  <TooltipIcon
                    ml="1"
                    label={
                      <Box>
                        <Text>
                          Tout élève inscrit à N+1 (réorientation et
                          redoublement compris).
                        </Text>
                        <Text>Cliquez pour plus d'infos.</Text>
                      </Box>
                    }
                    onClick={() => openGlossaire("taux-poursuite-etudes")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxDevenirFavorable")}
                  textAlign={"center"}
                >
                  <OrderIcon {...order} column="tauxDevenirFavorable" />
                  {FORMATION_COLUMNS.tauxDevenirFavorable}
                  <TooltipIcon
                    ml="1"
                    label={
                      <Box>
                        <Text>
                          (nombre d'élèves inscrits en formation + nombre
                          d'élèves en emploi) / nombre d'élèves en entrée en
                          dernière année de formation.
                        </Text>
                        <Text>Cliquez pour plus d'infos.</Text>
                      </Box>
                    }
                    onClick={() => openGlossaire("taux-de-devenir-favorable")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDispositif")}
                >
                  <OrderIcon {...order} column="libelleDispositif" />
                  {FORMATION_COLUMNS.libelleDispositif}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleFamille")}
                >
                  <OrderIcon {...order} column="libelleFamille" />
                  {FORMATION_COLUMNS.libelleFamille}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cfd")}>
                  <OrderIcon {...order} column="cfd" />
                  {FORMATION_COLUMNS.cfd}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpc")}>
                  <OrderIcon {...order} column="cpc" />
                  {FORMATION_COLUMNS.cpc}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpcSecteur")}>
                  <OrderIcon {...order} column="cpcSecteur" />
                  {FORMATION_COLUMNS.cpcSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("cpcSousSecteur")}
                >
                  <OrderIcon {...order} column="cpcSousSecteur" />
                  {FORMATION_COLUMNS.cpcSousSecteur}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("libelleNsf")}>
                  <OrderIcon {...order} column="libelleNsf" />
                  {FORMATION_COLUMNS.libelleNsf}
                  <TooltipIcon
                    ml="1"
                    label="cliquez pour plus d'infos."
                    onClick={() => openGlossaire("domaine-de-formation-nsf")}
                  />
                </Th>
                <Th>
                  {FORMATION_COLUMNS.positionQuadrant}
                  <TooltipIcon
                    ml="1"
                    label={
                      <Box>
                        <Text>
                          Positionnement du point de la formation dans le
                          quadrant par rapport aux moyennes régionales des taux
                          d'emploi et de poursuite d'études appliquées au niveau
                          de diplôme.
                        </Text>
                        <Text>Cliquez pour plus d'infos.</Text>
                      </Box>
                    }
                    onClick={() => openGlossaire("quadrant")}
                  />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.formations.map((line) => (
                <Fragment key={`${line.cfd}_${line.codeDispositif}`}>
                  <Tr h="12">
                    <FormationLineContent
                      defaultRentreeScolaire={CURRENT_RENTREE}
                      line={line}
                      expended={
                        historiqueId?.cfd === line.cfd &&
                        historiqueId.codeDispositif === line.codeDispositif
                      }
                      onClickExpend={() =>
                        setHistoriqueId({
                          cfd: line.cfd,
                          codeDispositif: line.codeDispositif,
                        })
                      }
                      onClickCollapse={() => setHistoriqueId(undefined)}
                    />
                  </Tr>
                  {historiqueId?.cfd === line.cfd &&
                    historiqueId.codeDispositif === line.codeDispositif && (
                      <>
                        {historique &&
                          historique.map((historiqueLine) => (
                            <Tr
                              key={`${historiqueLine.cfd}_${historiqueLine.codeDispositif}`}
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
    </>
  );
}
