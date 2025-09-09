"use client";

import { Button, chakra, Container, Flex, MenuButton } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import { parse } from "qs";
import { useContext, useEffect, useState } from "react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { OptionType } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import { CodeDepartementContext } from "@/app/codeDepartementContext";
import { CodeRegionContext } from "@/app/codeRegionContext";
import { GroupedMultiselect } from "@/components/GroupedMultiselect";
import { SearchInput } from "@/components/SearchInput";
import { TableHeader } from "@/components/TableHeader";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import type { DEMANDES_COLUMNS_OPTIONAL } from "./DEMANDES_COLUMN";
import { DEMANDES_COLUMNS_DEFAULT } from "./DEMANDES_COLUMN";
import { GROUPED_DEMANDES_COLUMNS_OPTIONAL } from "./GROUPED_DEMANDES_COLUMN";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import type { DEMANDES_COLUMNS_KEYS ,
  DemandesRestitution,
  FiltersDemandesRestitution,
  OrderDemandesRestitution,
} from "./types";
import { findDefaultRentreeScolaireForCampagne, getDataForExport } from "./utils";

type DisablableOptionType = {
    color: string;
    options: typeof DEMANDES_COLUMNS_OPTIONAL;
    isDisabled?: boolean;
    tooltip?: string;
  };

const ColonneFiltersSection = chakra(
  ({
    colonneFilters,
    handleColonneFilters,
    displayPilotageColumns,
    currentRS,
    allowPilotageColumnsToBeSelected
  }: {
    colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
    handleColonneFilters: (value: Array<DEMANDES_COLUMNS_KEYS>) => void;
    displayPilotageColumns: boolean;
    currentRS: string;
    allowPilotageColumnsToBeSelected: boolean;
  }) => {
    return (
      <Flex justifyContent={"start"} direction="row">
        <GroupedMultiselect
          width={"48"}
          size="md"
          variant={"newInput"}
          onChange={(selected) => handleColonneFilters(selected as Array<DEMANDES_COLUMNS_KEYS>)}
          groupedOptions={Object.entries(GROUPED_DEMANDES_COLUMNS_OPTIONAL).reduce(
            (acc, [group, { color, options }]) => {
              acc[group] = {
                color,
                options: Object.entries(options)
                  .map(([value, label]) => ({
                    label,
                    value,
                  }))
              };
              return acc;
            },
            {} as Record<
              string,
              {
                color: string;
                options: (OptionType & { disabled?: boolean })[];
              }
            >
          )}
          defaultOptions={Object.entries(DEMANDES_COLUMNS_DEFAULT)?.map(([value, label]) => {
            return {
              label,
              value,
            };
          })}
          value={colonneFilters ?? []}
          customButton={
            <MenuButton as={Button} variant={"externalLink"} leftIcon={<Icon icon={"ri:table-line"} />} color="bluefrance.113">
              Modifier l'affichage des colonnes
            </MenuButton>
          }
        />
      </Flex>
    );
  }
);

const PAGE_SIZE = 30;

export const PageClient = () => {
  const { campagne } = useCurrentCampagne();
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<FiltersDemandesRestitution>;
    columns?: Array<DEMANDES_COLUMNS_KEYS>;
    order?: Partial<OrderDemandesRestitution>;
    page?: string;
    search?: string;
  } = parse(queryParams.toString(), { arrayLimit: Infinity });

  const filters = searchParams.filters ?? {};
  const columns = searchParams.columns ?? [];
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const search = searchParams.search ?? "";

  const setSearchParams = (params: {
    filters?: typeof filters;
    columns?: typeof columns;
    order?: typeof order;
    page?: typeof page;
    search?: typeof search;
  }) => {
    router.replace(createParameterizedUrl(location.pathname, { ...searchParams, ...params }));
  };

  const [displayPilotageColumns, setDisplayPilotageColumns] = useState(false);
  const [allowPilotageColumnsToBeSelected, setAllowPilotageColumnsToBeSelected] = useState(false);

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof FiltersDemandesRestitution) => () => {
    trackEvent("restitution-demandes:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: OrderDemandesRestitution["orderBy"]) => {
    trackEvent("restitution-demandes:ordre", { props: { colonne: column } });
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

  const handleDefaultFilters = (
    type: keyof FiltersDemandesRestitution,
    value: FiltersDemandesRestitution[keyof FiltersDemandesRestitution]
  ) => {
    if (value != null)
      switch (type) {
      case "codeRegion":
        setCodeRegion((value as string[])[0] ?? "");
        break;
      case "codeDepartement":
        setCodeDepartement((value as string[])[0] ?? "");
        break;
      case "statut":
        setStatutFilter(value as Exclude<DemandeStatutType, "supprimée">[]);
        break;
      }
  };

  const handleFilters = (
    type: keyof FiltersDemandesRestitution,
    value: FiltersDemandesRestitution[keyof FiltersDemandesRestitution]
  ) => {
    handleDefaultFilters(type, value);
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const handleColonneFilters = (value: Array<DEMANDES_COLUMNS_KEYS>) => {
    setSearchParams({ columns: value });
    setColonneFilters(value);
  };

  const resetFilters = () => {
    setSearchParams({
      filters: {
        ...filters,
        codeNsf: [],
        cfd: [],
        codeNiveauDiplome: [],
        codeDepartement: [],
        uai: [],
        secteur: undefined,
        statut: statutFilter,
        typeDemande: [],
        voie: undefined,
        coloration: undefined,
        amiCMA: undefined,
      },
      search: "",
    });
  };

  const getStatsQueryParameters = (qLimit?: number, qOffset?: number) => ({
    ...filters,
    ...order,
    search,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/restitution/demandes").useQuery(
    {
      query: getStatsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
      onSuccess: (data) => {
        setDefaultFilters(data);
      }
    }
  );

  const { data: countData, isLoading: isLoadingCount } = client.ref("[GET]/restitution/stats").useQuery(
    {
      query: {
        ...filters,
        search,
      },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { codeRegion, setCodeRegion } = useContext(CodeRegionContext);
  const { codeDepartement, setCodeDepartement } = useContext(CodeDepartementContext);

  const [colonneFilters, setColonneFilters] = useState<Array<DEMANDES_COLUMNS_KEYS>>(
    (columns.length
      ? columns
      : Object.keys(DEMANDES_COLUMNS_DEFAULT)) as Array<DEMANDES_COLUMNS_KEYS>
  );

  const [statutFilter, setStatutFilter] = useState<Exclude<DemandeStatutType, "supprimée">[] | undefined>();

  const [searchDemande, setSearchDemande] = useState<string>(search);

  const setDefaultFilters = (data: DemandesRestitution | undefined) => {
    if (
      filters?.codeRegion === undefined &&
      filters?.codeAcademie === undefined &&
      filters?.codeDepartement === undefined &&
      codeRegion
    ) {
      filters.codeRegion = [codeRegion];
    }

    if (
      filters?.codeRegion === undefined &&
      filters?.codeAcademie === undefined &&
      filters?.codeDepartement === undefined &&
      codeDepartement
    ) {
      filters.codeDepartement = [codeDepartement];
    }

    if (filters?.campagne === undefined) {
      filters.campagne = campagne?.annee;

      if(data){
        filters.rentreeScolaire = findDefaultRentreeScolaireForCampagne(
          data.campagne.annee,
          data.filters.rentreesScolaires
        );
      }
    }

    if (filters?.statut === undefined) {
      // Par défaut on affiche les demandes avec tous les status, sauf : supprimée, brouillon et refusée.
      filters.statut = _.values(DemandeStatutEnum).filter(
        (statut) =>
          statut !== DemandeStatutEnum["supprimée"] &&
          statut !== DemandeStatutEnum["brouillon"] &&
          statut !== DemandeStatutEnum["refusée"]
      ) as Exclude<DemandeStatutType, "supprimée" | "brouillon" | "refusée">[];
    }

    setSearchParams({ filters: filters });
  };

  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("restitution-demandes:export");
    const data = await client.ref("[GET]/restitution/demandes").query({
      query: isFiltered ? getStatsQueryParameters() : {},
    });

    const { columns, demandes } = getDataForExport({
      data,
      filters,
      addPilotageColumns: allowPilotageColumnsToBeSelected
    });
    downloadCsv(formatExportFilename("restitution_export"), demandes, columns);
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("restitution-demandes:export-excel");
    const data = await client.ref("[GET]/restitution/demandes").query({
      query: isFiltered ? getStatsQueryParameters() : {},
    });

    const { columns, demandes } = getDataForExport({
      data,
      filters,
      addPilotageColumns: allowPilotageColumnsToBeSelected
    });
    downloadExcel(formatExportFilename("restitution_export"), demandes, columns);
  };

  const onClickSearch = () => {
    setSearchParams({
      filters: filters,
      order: order,
      search: searchDemande,
    });
  };

  useEffect(() => {
    setDisplayPilotageColumns(!!filters.rentreeScolaire);
  }, [data?.rentreesPilotage, filters.rentreeScolaire]);

  useEffect(() => {
    setAllowPilotageColumnsToBeSelected(data?.rentreesPilotage?.includes(filters.rentreeScolaire ?? "") ?? false);
  }, [data?.rentreesPilotage, filters.rentreeScolaire]);

  useEffect(() => {
    if(!allowPilotageColumnsToBeSelected) {
      setColonneFilters((cln) => cln.filter((colonne) =>
        colonne !== "pilotageCapacite" &&
        colonne !== "pilotageEffectif" &&
        colonne !== "pilotageTauxRemplissage" &&
        colonne !== "pilotageTauxPression" &&
        colonne !== "pilotageTauxDemande"
      ));
    }
  }, [allowPilotageColumnsToBeSelected]);

  return (
    <Container maxWidth={"100%"} pt={8} bg="blueecume.925" pb={20} flex={1}>
      <HeaderSection
        countData={countData}
        activeFilters={filters}
        handleFilters={handleFilters}
        filterTracker={filterTracker}
        resetFilters={resetFilters}
        isLoading={(isLoading || isLoadingCount)}
        data={data}
      />
      <TableHeader
        SearchInput={
          <SearchInput
            placeholder="Rechercher un numéro, établissement, formation..."
            onChange={setSearchDemande}
            value={searchDemande}
            onClick={onClickSearch}
          />
        }
        ColonneFilter={
          <ColonneFiltersSection
            colonneFilters={colonneFilters}
            handleColonneFilters={handleColonneFilters}
            currentRS={filters.rentreeScolaire ?? ""}
            displayPilotageColumns={displayPilotageColumns}
            allowPilotageColumnsToBeSelected={allowPilotageColumnsToBeSelected}
          />
        }
        onExportCsv={onExportCsv}
        onExportExcel={onExportExcel}
        page={page}
        pageSize={PAGE_SIZE}
        count={data?.count}
        onPageChange={(newPage) => setSearchParams({ page: newPage })}
      />
      <ConsoleSection
        data={data}
        isLoading={isLoading}
        handleOrder={handleOrder}
        activeFilters={filters}
        order={order}
        colonneFilters={colonneFilters}
        displayPilotageColumns={displayPilotageColumns}
        currentRS={filters.rentreeScolaire ?? ""}
      />
    </Container>
  );
};
