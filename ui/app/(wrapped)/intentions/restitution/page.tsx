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
import { PermissionEnum } from 'shared/enum/permissionEnum';

import { client } from "@/api.client";
import { CodeDepartementContext } from "@/app/codeDepartementContext";
import { CodeRegionContext } from "@/app/codeRegionContext";
import { GroupedMultiselect } from "@/components/GroupedMultiselect";
import { SearchInput } from "@/components/SearchInput";
import { TableHeader } from "@/components/TableHeader";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";
import { GuardPermission } from "@/utils/security/GuardPermission";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import { GROUPED_STATS_DEMANDES_COLUMNS_OPTIONAL } from "./GROUPED_STATS_DEMANDES_COLUMN";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import type { STATS_DEMANDES_COLUMNS_OPTIONAL } from "./STATS_DEMANDES_COLUMN";
import { STATS_DEMANDES_COLUMNS_DEFAULT } from "./STATS_DEMANDES_COLUMN";
import type {
  DemandesRestitutionIntentions,
  FiltersDemandesRestitutionIntentions,
  OrderDemandesRestitutionIntentions,
} from "./types";
import { findDefaultRentreeScolaireForCampagne, getDataForExport } from "./utils";

type DisablableOptionType = {
    color: string;
    options: typeof STATS_DEMANDES_COLUMNS_OPTIONAL;
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
    colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[];
    handleColonneFilters: (value: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[]) => void;
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
          onChange={(selected) => handleColonneFilters(selected as (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[])}
          groupedOptions={Object.entries(GROUPED_STATS_DEMANDES_COLUMNS_OPTIONAL)
            .filter(([key]) => key !== "pilotage" || displayPilotageColumns)
            .map((groupedOptions): [string, DisablableOptionType] =>
            {
              const [key, {color, options}] = groupedOptions;

              if(key === "pilotage") {

                const values = {color, options: {
                  ...options,
                  pilotageCapacite: options.pilotageCapacite?.replace("{0}", currentRS),
                  pilotageEffectif: options.pilotageEffectif?.replace("{0}", currentRS),
                  pilotageTauxRemplissage: options.pilotageTauxRemplissage?.replace("{0}", currentRS),
                  pilotageTauxPression: options.pilotageTauxPression?.replace("{0}", currentRS),
                  pilotageTauxDemande: options.pilotageTauxDemande?.replace("{0}", currentRS),
                },
                isDisabled: !allowPilotageColumnsToBeSelected,
                tooltip: !allowPilotageColumnsToBeSelected ? "Cette valeur ne peut pas être sélectionnée, car le constat de rentrée associé n’est pas encore disponible." : undefined
                };

                return  [key,values ];
              }

              const values = {color, options, isDisabled: false, tooltip: undefined};

              return [key, values];
            })
            .reduce(
              (acc, [group, { color, options, isDisabled, tooltip }]) => {
                acc[group] = {
                  color,
                  options: Object.entries(options).map(([value, label]) => ({
                    label,
                    value,
                    isDisabled,
                    tooltip
                  })),
                };
                return acc;
              },
            {} as Record<string, {
                color: string;
                options: { label: string; value: string, isDisabled?:boolean, tooltip?:string }[]
              }>
            )}
          defaultOptions={Object.entries(STATS_DEMANDES_COLUMNS_DEFAULT)?.map(([value, label]) => {
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

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const { campagne } = useCurrentCampagne();
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<FiltersDemandesRestitutionIntentions>;
    columns?: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[];
    order?: Partial<OrderDemandesRestitutionIntentions>;
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
  const filterTracker = (filterName: keyof FiltersDemandesRestitutionIntentions) => () => {
    trackEvent("restitution-demandes:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: OrderDemandesRestitutionIntentions["orderBy"]) => {
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
    type: keyof FiltersDemandesRestitutionIntentions,
    value: FiltersDemandesRestitutionIntentions[keyof FiltersDemandesRestitutionIntentions]
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
    type: keyof FiltersDemandesRestitutionIntentions,
    value: FiltersDemandesRestitutionIntentions[keyof FiltersDemandesRestitutionIntentions]
  ) => {
    handleDefaultFilters(type, value);
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const handleColonneFilters = (value: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[]) => {
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

  const getIntentionsStatsQueryParameters = (qLimit?: number, qOffset?: number) => ({
    ...filters,
    ...order,
    search,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/restitution-intentions/demandes").useQuery(
    {
      query: getIntentionsStatsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
      onSuccess: (data) => {
        setDefaultFilters(data);
      }
    }
  );

  const { data: countData, isLoading: isLoadingCount } = client.ref("[GET]/restitution-intentions/stats").useQuery(
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

  const [colonneFilters, setColonneFilters] = useState<(keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[]>(
    (columns.length
      ? columns
      : Object.keys(STATS_DEMANDES_COLUMNS_DEFAULT)) as (keyof typeof STATS_DEMANDES_COLUMNS_DEFAULT)[]
  );

  const [statutFilter, setStatutFilter] = useState<Exclude<DemandeStatutType, "supprimée">[] | undefined>();

  const [searchIntention, setSearchIntention] = useState<string>(search);

  const setDefaultFilters = (data: DemandesRestitutionIntentions | undefined) => {
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
    const data = await client.ref("[GET]/restitution-intentions/demandes").query({
      query: isFiltered ? getIntentionsStatsQueryParameters() : {},
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
    const data = await client.ref("[GET]/restitution-intentions/demandes").query({
      query: isFiltered ? getIntentionsStatsQueryParameters() : {},
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
      search: searchIntention,
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
      setColonneFilters((cln) => cln.filter((colonne) => colonne !== "pilotageCapacite" && colonne !== "pilotageEffectif" && colonne !== "pilotageTauxRemplissage" && colonne !== "pilotageTauxPression" && colonne !== "pilotageTauxDemande"));
    }
  }, [allowPilotageColumnsToBeSelected]);

  return (
    <GuardPermission permission={PermissionEnum["restitution-intentions/lecture"]}>
      <Container maxWidth={"100%"} pt={8} bg="blueecume.925" pb={20} flex={1}>
        <HeaderSection
          countData={countData}
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          resetFilters={resetFilters}
          isLoading={isLoading || isLoadingCount}
          data={data}
        />
        <TableHeader
          SearchInput={
            <SearchInput
              placeholder="Rechercher un numéro, établissement, formation..."
              onChange={setSearchIntention}
              value={searchIntention}
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
          order={order}
          colonneFilters={colonneFilters}
          displayPilotageColumns={displayPilotageColumns}
          currentRS={filters.rentreeScolaire ?? ""}
        />
      </Container>
    </GuardPermission>
  );
};
