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
  libelleFormation: "Formation",
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
  libelleFamille: "	Famille de métiers",
  cfd: "Code formation diplôme",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  cpcSousSecteur: "CPC Sous Secteur",
  libelleFiliere: "Secteur d’activité",
  "continuum.libelleFormation": "Diplôme historique",
  "continuum.cfd": "Code diplôme historique",
  positionQuadrant: "Position dans le quadrant",
  codeDispositif: "Code dispositif",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/formations"]["formations"][number]
>;

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
    if (codeRegionFilter != "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  const { data, isFetching } = client.ref("[GET]/formations").useQuery(
    {
      query: {
        ...order,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        ...filters,
        withAnneeCommune: withAnneeCommune?.toString() ?? "true",
      },
    },
    { staleTime: 10000000, keepPreviousData: true }
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
              (rentree) => rentree != CURRENT_RENTREE
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
          width="12rem"
          onClose={filterTracker("cpcSecteur")}
          onChange={(selected) => handleFilters("cpcSecteur", selected)}
          options={data?.filters.cpcSecteurs}
          value={filters.cpcSecteur ?? []}
        >
          CPC Secteur
        </Multiselect>
        <Multiselect
          display={["none", null, "flex"]}
          width="12rem"
          onClose={filterTracker("cpcSousSecteur")}
          onChange={(selected) => handleFilters("cpcSousSecteur", selected)}
          options={data?.filters.cpcSousSecteurs}
          value={filters.cpcSousSecteur ?? []}
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
        <Flex w="24rem" mr="3">
          <Checkbox
            size="lg"
            variant="accessible"
            onChange={(event) => {
              console.log(event.target.checked);
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
                  onClick={() => handleOrder("libelleFormation")}
                >
                  <OrderIcon {...order} column="libelleFormation" />
                  {FORMATIONS_COLUMNS.libelleFormation}
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
                  onClick={() => handleOrder("libelleFamille")}
                >
                  <OrderIcon {...order} column="libelleFamille" />
                  {FORMATIONS_COLUMNS.libelleFamille}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cfd")}>
                  <OrderIcon {...order} column="cfd" />
                  {FORMATIONS_COLUMNS.cfd}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpc")}>
                  <OrderIcon {...order} column="cpc" />
                  {FORMATIONS_COLUMNS.cpc}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpcSecteur")}>
                  <OrderIcon {...order} column="cpcSecteur" />
                  {FORMATIONS_COLUMNS.cpcSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("cpcSousSecteur")}
                >
                  <OrderIcon {...order} column="cpcSousSecteur" />
                  {FORMATIONS_COLUMNS.cpcSousSecteur}
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
