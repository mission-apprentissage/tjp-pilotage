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
import { unstable_batchedUpdates } from "react-dom";
import { CURRENT_RENTREE, RENTREES_SCOLAIRES } from "shared";

import { client } from "@/api.client";
import { FORMATION_ETABLISSEMENT_COLUMNS } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import { Multiselect } from "@/components/Multiselect";
import { OrderIcon } from "@/components/OrderIcon";
import { TooltipIcon } from "@/components/TooltipIcon";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

import { TableHeader } from "../../../../components/TableHeader";
import {
  CodeRegionFilterContext,
  UaiFilterContext,
} from "../../../layoutClient";
import { TauxPressionScale } from "../../components/TauxPressionScale";
import { useGlossaireContext } from "../../glossaire/glossaireContext";
import {
  EtablissementLineContent,
  EtablissementLineLoader,
  EtablissementLinePlaceholder,
} from "./components/LineContent";
import { Filters, LineId, Order } from "./types";

const PAGE_SIZE = 30;
const EXPORT_LIMIT = 1_000_000;

export default function Etablissements() {
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

  const { uaiFilter, setUaiFilter } = useContext(UaiFilterContext);

  useEffect(() => {
    if (codeRegionFilter !== "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
    if (uaiFilter !== "") {
      filters.uai = [uaiFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  const getEtablissementsQueryParameters = (
    qLimit: number,
    qOffset?: number
  ) => ({
    ...order,
    ...filters,
    offset: qOffset,
    limit: qLimit,
    withAnneeCommune: withAnneeCommune?.toString() ?? "true",
  });

  const { data, isFetching } = client.ref("[GET]/etablissements").useQuery(
    {
      query: getEtablissementsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    {
      staleTime: 10000000,
    }
  );

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
    if (type === "uai" && value != null)
      setUaiFilter((value as string[])[0] ?? "");
    if (type === "codeRegion" && value != null)
      setCodeRegionFilter((value as string[])[0] ?? "");
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
        withAnneeCommune,
      });
    });
  };

  const handleToggleShowAnneeCommune = (value: string) => {
    setSearchParams({
      withAnneeCommune: value,
    });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("etablissements:filtre", { props: { filter_name: filterName } });
  };

  const [historiqueId, setHistoriqueId] = useState<LineId>();

  const { openGlossaire } = useGlossaireContext();

  const { data: historique, isFetching: isFetchingHistorique } = useQuery({
    keepPreviousData: false,
    staleTime: 10000000,
    queryKey: ["formations", historiqueId, filters],
    enabled: !!historiqueId,
    queryFn: async () => {
      if (!historiqueId) return;
      return (
        await client.ref("[GET]/etablissements").query({
          query: {
            ...filters,
            cfd: [historiqueId?.cfd],
            codeDispositif: historiqueId?.codeDispositif
              ? [historiqueId?.codeDispositif]
              : undefined,
            uai: [historiqueId.uai],
            limit: 2,
            order: "desc",
            orderBy: "rentreeScolaire",
            rentreeScolaire: RENTREES_SCOLAIRES.filter(
              (rentree) => rentree !== CURRENT_RENTREE
            ),
          },
        })
      ).etablissements;
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
          onClose={filterTracker("uai")}
          width="12rem"
          onChange={(selected) => handleFilters("uai", selected)}
          options={data?.filters.etablissements}
          value={filters.uai ?? []}
        >
          Établissement
        </Multiselect>
        <Multiselect
          onClose={filterTracker("secteur")}
          width="12rem"
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
          width="12rem"
          onChange={(selected) => handleFilters("codeDiplome", selected)}
          options={data?.filters.diplomes}
          value={filters.codeDiplome ?? []}
        >
          Diplôme
        </Multiselect>
        <Multiselect
          onClose={filterTracker("codeDispositif")}
          width="12rem"
          onChange={(selected) => handleFilters("codeDispositif", selected)}
          options={data?.filters.dispositifs}
          value={filters.codeDispositif ?? []}
        >
          Dispositif
        </Multiselect>
        <Multiselect
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
          onClose={filterTracker("cpc")}
          width="12rem"
          onChange={(selected) => handleFilters("cpc", selected)}
          options={data?.filters.cpcs}
          value={filters.cpc ?? []}
        >
          CPC
        </Multiselect>
        <Multiselect
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
            onChange={(event) => {
              handleToggleShowAnneeCommune(
                event.target.checked.toString() ?? "false"
              );
            }}
            isChecked={searchParams.withAnneeCommune !== "false"}
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
            const data = await client.ref("[GET]/etablissements").query({
              query: getEtablissementsQueryParameters(EXPORT_LIMIT),
            });
            trackEvent("etablissements:export");
            downloadCsv(
              "etablissement_export",
              data.etablissements,
              FORMATION_ETABLISSEMENT_COLUMNS
            );
          }}
          onExportExcel={async () => {
            const data = await client.ref("[GET]/etablissements").query({
              query: getEtablissementsQueryParameters(EXPORT_LIMIT),
            });
            trackEvent("etablissements:export-excel");
            downloadExcel(
              "etablissement_export",
              data.etablissements,
              FORMATION_ETABLISSEMENT_COLUMNS
            );
          }}
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
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
                <Th>{FORMATION_ETABLISSEMENT_COLUMNS.rentreeScolaire}</Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleEtablissement")}
                >
                  <OrderIcon {...order} column="libelleEtablissement" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.libelleEtablissement}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("commune")}>
                  <OrderIcon {...order} column="commune" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.commune}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDepartement")}
                >
                  <OrderIcon {...order} column="libelleDepartement" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.libelleDepartement}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleNiveauDiplome")}
                >
                  <OrderIcon {...order} column="libelleNiveauDiplome" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.libelleNiveauDiplome}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleFormation")}
                >
                  <OrderIcon {...order} column="libelleFormation" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.libelleFormation}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif1")}
                >
                  <OrderIcon {...order} column="effectif1" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.effectif1}
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
                  {FORMATION_ETABLISSEMENT_COLUMNS.effectif2}
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
                  {FORMATION_ETABLISSEMENT_COLUMNS.effectif3}
                  <TooltipIcon
                    ml="1"
                    label="Nb d'élèves"
                    onClick={() => openGlossaire("effectifs")}
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("capacite")}
                >
                  <OrderIcon {...order} column="capacite" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.capacite}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPression")}
                >
                  <OrderIcon {...order} column="tauxPression" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.tauxPression}
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
                >
                  <OrderIcon {...order} column="tauxRemplissage" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.tauxRemplissage}
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
                >
                  <OrderIcon {...order} column="tauxInsertion" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertion}
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
                >
                  <OrderIcon {...order} column="tauxPoursuite" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuite}
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
                <Th>
                  {FORMATION_ETABLISSEMENT_COLUMNS.positionQuadrant}
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
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxDevenirFavorable")}
                >
                  <OrderIcon {...order} column="tauxDevenirFavorable" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorable}
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
                  onClick={() => handleOrder("tauxInsertionEtablissement")}
                >
                  <OrderIcon {...order} column="tauxInsertionEtablissement" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertionEtablissement}
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
                    onClick={() => openGlossaire("taux-de-devenir-favorable")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPoursuiteEtablissement")}
                >
                  <OrderIcon {...order} column="tauxPoursuiteEtablissement" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuiteEtablissement}
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
                  onClick={() =>
                    handleOrder("tauxDevenirFavorableEtablissement")
                  }
                >
                  <OrderIcon
                    {...order}
                    column="tauxDevenirFavorableEtablissement"
                  />
                  {
                    FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorableEtablissement
                  }
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
                    onClick={() => openGlossaire("taux-de-devenir-favorable")}
                  />
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("valeurAjoutee")}
                >
                  <OrderIcon {...order} column="valeurAjoutee" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.valeurAjoutee}
                  <TooltipIcon
                    ml="1"
                    label={
                      <Box>
                        <Text>
                          Capacité de l'établissement à insérer, en prenant en
                          compte le profil social des élèves et le taux de
                          chômage de la zone d'emploi, comparativement au taux
                          de référence d’établissements similaires.
                        </Text>
                        <Text>Cliquez pour plus d'infos.</Text>
                      </Box>
                    }
                    onClick={() => openGlossaire("valeur-ajoutee")}
                  />
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("secteur")}>
                  <OrderIcon {...order} column="secteur" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.secteur}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("uai")}>
                  <OrderIcon {...order} column="uai" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.uai}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleDispositif")}
                >
                  <OrderIcon {...order} column="libelleDispositif" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.libelleDispositif}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("libelleFamille")}
                >
                  <OrderIcon {...order} column="libelleFamille" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.libelleFamille}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cfd")}>
                  <OrderIcon {...order} column="cfd" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.cfd}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpc")}>
                  <OrderIcon {...order} column="cpc" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.cpc}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpcSecteur")}>
                  <OrderIcon {...order} column="cpcSecteur" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.cpcSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("cpcSousSecteur")}
                >
                  <OrderIcon {...order} column="cpcSousSecteur" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.cpcSousSecteur}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("libelleNsf")}>
                  <OrderIcon {...order} column="libelleNsf" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.libelleNsf}
                  <TooltipIcon
                    ml="1"
                    label="cliquez pour plus d'infos."
                    onClick={() => openGlossaire("domaine-de-formation-nsf")}
                  />
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("effectifEntree")}
                >
                  <OrderIcon {...order} column="effectifEntree" />
                  {FORMATION_ETABLISSEMENT_COLUMNS.effectifEntree}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.etablissements.map((line) => (
                <Fragment
                  key={`${line.uai}_${line.codeDispositif}_${line.cfd}`}
                >
                  <Tr h="12">
                    <EtablissementLineContent
                      line={line}
                      defaultRentreeScolaire={CURRENT_RENTREE}
                      expended={
                        historiqueId?.cfd === line.cfd &&
                        historiqueId.codeDispositif === line.codeDispositif &&
                        historiqueId.uai === line.uai
                      }
                      onClickExpend={() =>
                        setHistoriqueId({
                          cfd: line.cfd,
                          codeDispositif: line.codeDispositif,
                          uai: line.uai,
                        })
                      }
                      onClickCollapse={() => setHistoriqueId(undefined)}
                    />
                  </Tr>
                  {historiqueId?.cfd === line.cfd &&
                    historiqueId.codeDispositif === line.codeDispositif &&
                    historiqueId.uai === line.uai && (
                      <>
                        {historique?.map((historiqueLine) => (
                          <Tr
                            key={`${historiqueLine.cfd}_${historiqueLine.codeDispositif}`}
                            bg={"grey.975"}
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
    </>
  );
}
