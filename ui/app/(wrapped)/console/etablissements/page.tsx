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
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { ExportColumns } from "@/utils/downloadCsv";

import { Multiselect } from "../../../../components/Multiselect";
import { TooltipIcon } from "../../../../components/TooltipIcon";
import { downloadCsv } from "../../../../utils/downloadCsv";
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

const ETABLISSEMENTS_COLUMNS = {
  libelleEtablissement: "Nom d'établissement",
  rentreeScolaire: "RS",
  commune: "Commune",
  departement: "Département",
  libelleNiveauDiplome: "Diplome",
  libelleFormation: "Formation",
  effectif1: "Année 1",
  effectif2: "Année 2",
  effectif3: "Année 3",
  capacite: "Capacité",
  premiersVoeux: "Nb de premiers voeux",
  tauxPression: "Tx de pression",
  tauxRemplissage: "Tx de remplissage",
  tauxInsertion: "Tx d'emploi 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  positionQuadrant: "Positionnement dans le quadrant",
  tauxDevenirFavorable: "Tx de devenir favorable régional",
  tauxInsertionEtablissement:
    "Tx d'emploi 6 mois de la formation dans l'établissement",
  tauxPoursuiteEtablissement:
    "Tx de poursuite d'études de la formation dans l'établissement",
  tauxDevenirFavorableEtablissement:
    "Tx de devenir favorable de la formation dans l'établissement",
  valeurAjoutee: "Valeur ajoutée",
  secteur: "Secteur",
  uai: "UAI",
  libelleDispositif: "Dispositif",
  libelleFamille: "Famille de métiers",
  cfd: "Code formation diplôme",
  cpc: "CPC",
  cpcSecteur: "CPC Secteur",
  cpcSousSecteur: "CPC Sous Secteur",
  libelleNsf: "Domaine de formation (NSF)",
  "continuum.libelleFormation": "Diplôme historique",
  "continuum.cfd": "Code diplôme historique",
  codeDispositif: "Code dispositif",
  codeRegion: "Code Région",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/etablissements"]["etablissements"][number]
>;

type Query = (typeof client.inferArgs)["[GET]/etablissements"]["query"];

export type Line =
  (typeof client.infer)["[GET]/etablissements"]["etablissements"][number];

type Filters = Query;

type Order = Pick<Query, "order" | "orderBy">;

type LineId = {
  codeDispositif?: string;
  cfd: string;
  uai: string;
};

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
    { keepPreviousData: false }
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
          variant="dsfr"
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
          onClose={filterTracker("cpcSecteur")}
          width="12rem"
          onChange={(selected) => handleFilters("cpcSecteur", selected)}
          options={data?.filters.cpcSecteurs}
          value={filters.cpcSecteur ?? []}
        >
          CPC Secteur
        </Multiselect>
        <Multiselect
          onClose={filterTracker("cpcSousSecteur")}
          width="12rem"
          onChange={(selected) => handleFilters("cpcSousSecteur", selected)}
          options={data?.filters.cpcSousSecteurs}
          value={filters.cpcSousSecteur ?? []}
        >
          CPC Sous Secteur
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
                  onClick={() => handleOrder("libelleFormation")}
                >
                  <OrderIcon {...order} column="libelleFormation" />
                  {ETABLISSEMENTS_COLUMNS.libelleFormation}
                </Th>
                <Th
                  isNumeric
                  cursor="pointer"
                  onClick={() => handleOrder("effectif1")}
                >
                  <OrderIcon {...order} column="effectif1" />
                  {ETABLISSEMENTS_COLUMNS.effectif1}
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
                  {ETABLISSEMENTS_COLUMNS.effectif2}
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
                  {ETABLISSEMENTS_COLUMNS.effectif3}
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
                  {ETABLISSEMENTS_COLUMNS.capacite}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("tauxPression")}
                >
                  <OrderIcon {...order} column="tauxPression" />
                  {ETABLISSEMENTS_COLUMNS.tauxPression}
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
                  {ETABLISSEMENTS_COLUMNS.tauxRemplissage}
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
                  {ETABLISSEMENTS_COLUMNS.tauxInsertion}
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
                  {ETABLISSEMENTS_COLUMNS.tauxPoursuite}
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
                  {ETABLISSEMENTS_COLUMNS.positionQuadrant}
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
                  {ETABLISSEMENTS_COLUMNS.tauxDevenirFavorable}
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
                  {ETABLISSEMENTS_COLUMNS.tauxInsertionEtablissement}
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
                  {ETABLISSEMENTS_COLUMNS.tauxPoursuiteEtablissement}
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
                  {ETABLISSEMENTS_COLUMNS.tauxDevenirFavorableEtablissement}
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
                  {ETABLISSEMENTS_COLUMNS.valeurAjoutee}
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
                  {ETABLISSEMENTS_COLUMNS.secteur}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("uai")}>
                  <OrderIcon {...order} column="uai" />
                  {ETABLISSEMENTS_COLUMNS.uai}
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
                  onClick={() => handleOrder("libelleFamille")}
                >
                  <OrderIcon {...order} column="libelleFamille" />
                  {ETABLISSEMENTS_COLUMNS.libelleFamille}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cfd")}>
                  <OrderIcon {...order} column="cfd" />
                  {ETABLISSEMENTS_COLUMNS.cfd}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpc")}>
                  <OrderIcon {...order} column="cpc" />
                  {ETABLISSEMENTS_COLUMNS.cpc}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("cpcSecteur")}>
                  <OrderIcon {...order} column="cpcSecteur" />
                  {ETABLISSEMENTS_COLUMNS.cpcSecteur}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleOrder("cpcSousSecteur")}
                >
                  <OrderIcon {...order} column="cpcSousSecteur" />
                  {ETABLISSEMENTS_COLUMNS.cpcSousSecteur}
                </Th>
                <Th cursor="pointer" onClick={() => handleOrder("libelleNsf")}>
                  <OrderIcon {...order} column="libelleNsf" />
                  {ETABLISSEMENTS_COLUMNS.libelleNsf}
                  <TooltipIcon
                    ml="1"
                    label="cliquez pour plus d'infos."
                    onClick={() => openGlossaire("domaine-de-formation-nsf")}
                  />
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
                        {historique &&
                          historique.map((historiqueLine) => (
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
      <TableFooter
        onExport={async () => {
          const data = await client.ref("[GET]/etablissements").query({
            query: getEtablissementsQueryParameters(EXPORT_LIMIT),
          });
          trackEvent("etablissements:export");
          downloadCsv(
            "etablissement_export.csv",
            data.etablissements,
            ETABLISSEMENTS_COLUMNS
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
