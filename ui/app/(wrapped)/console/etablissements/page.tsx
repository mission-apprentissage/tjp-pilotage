"use client";

import { Button, Center, chakra, Flex, Spinner } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { Fragment, useState } from "react";

import { client } from "@/api.client";
import { GroupedMultiselect } from "@/components/GroupedMultiselect";
import { SearchInput } from "@/components/SearchInput";
import { TableHeader } from "@/components/TableHeader";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";

import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import {
  FORMATION_ETABLISSEMENT_COLUMNS,
  FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT,
} from "./FORMATION_ETABLISSEMENT_COLUMNS";
import { GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL } from "./GROUPED_FORMATION_ETABLISSEMENT_COLUMNS";
import { FiltersSection } from "./HeaderSection/FiltersSection";
import type { Filters, Order } from "./types";

const PAGE_SIZE = 30;
const EXPORT_LIMIT = 1_000_000;

type QueryResult = (typeof client.infer)["[GET]/etablissements"];

const ColonneFiltersSection = chakra(
  ({
    colonneFilters,
    forcedColonnes,
    handleColonneFilters,
    trackEvent,
  }: {
    colonneFilters: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    forcedColonnes?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    handleColonneFilters: (value: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[]) => void;
    trackEvent: (name: string, params?: Record<string, unknown>) => void;
  }) => {
    return (
      <Flex justifyContent={"start"} direction="row">
        <GroupedMultiselect
          width={"48"}
          size="md"
          variant={"newInput"}
          onChange={(selected) => handleColonneFilters(selected as (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[])}
          groupedOptions={Object.entries(GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL).reduce(
            (acc, [group, { color, options }]) => {
              acc[group] = {
                color,
                options: Object.entries(options).map(([value, label]) => ({
                  label,
                  value,
                  isDisabled: forcedColonnes?.includes(value as keyof typeof FORMATION_ETABLISSEMENT_COLUMNS),
                })),
              };
              return acc;
            },
            {} as Record<
              string,
              {
                color: string;
                options: { label: string; value: string; disabled?: boolean }[];
              }
            >
          )}
          defaultOptions={Object.entries(FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT)?.map(([value, label]) => {
            return {
              label,
              value,
            };
          })}
          value={colonneFilters ?? []}
          customButton={
            <Button
              variant={"externalLink"}
              leftIcon={<Icon icon={"ri:table-line"} />}
              color="bluefrance.113"
              onClick={() => trackEvent("etablissements:affichage-colonnes")}
            >
              Modifier l'affichage des colonnes
            </Button>
          }
        />
      </Flex>
    );
  }
);

export default function Etablissements() {
  const trackEvent = usePlausible();
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

  const setSearchParams = (params: {
    filters?: typeof filters;
    search?: typeof search;
    withAnneeCommune?: typeof withAnneeCommune;
    columns?: typeof columns;
    order?: typeof order;
    page?: typeof page;
  }) => {
    router.replace(createParametrizedUrl(location.pathname, { ...searchParams, ...params }));
  };

  const filters = searchParams.filters ?? {};
  const withAnneeCommune = searchParams.withAnneeCommune ?? "true";
  const columns = searchParams.columns ?? [];
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const search = searchParams.search ?? "";

  const [searchFormationEtablissement, setSearchFormationEtablissement] = useState<string>(search);

  const getEtablissementsQueryParameters = (qLimit: number, qOffset?: number) => ({
    ...order,
    ...filters,
    search,
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

  const getDataForExport = (data: QueryResult) => {
    const region = data.filters.regions.find((r) => r.value === filters.codeRegion?.[0]);

    if (filters.codeRegion && region) {
      const columns = {
        ...FORMATION_ETABLISSEMENT_COLUMNS,
        selectedCodeRegion: "Code Région sélectionné",
        selectedRegion: "Région sélectionnée",
      };

      let etablissements = data.etablissements;

      etablissements = data.etablissements.map((f) => ({
        ...f,
        selectedCodeRegion: region.value,
        selectedRegion: region.label,
      }));

      return {
        columns,
        etablissements,
      };
    }

    return {
      columns: { ...FORMATION_ETABLISSEMENT_COLUMNS },
      etablissements: data.etablissements,
    };
  };

  const onExportCsv = async () => {
    trackEvent("formations:export");
    const data = await client.ref("[GET]/etablissements").query({
      query: getEtablissementsQueryParameters(EXPORT_LIMIT),
    });

    const { columns, etablissements } = getDataForExport(data);

    downloadCsv(formatExportFilename("etablissement_export", filters?.codeRegion), etablissements, columns);
  };

  const onExportExcel = async () => {
    const data = await client.ref("[GET]/etablissements").query({
      query: getEtablissementsQueryParameters(EXPORT_LIMIT),
    });
    trackEvent("etablissements:export-excel");

    const { columns, etablissements } = getDataForExport(data);

    downloadExcel(formatExportFilename("etablissement_export", filters?.codeRegion), etablissements, columns);
  };

  const [colonneFilters, setColonneFilters] = useState<(keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[]>(
    (columns.length
      ? columns
      : Object.keys(FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT)) as (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[]
  );

  const handleColonneFilters = (value: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[]) => {
    setSearchParams({ columns: value });
    setColonneFilters(value);
  };

  const onClickSearch = () => {
    setSearchParams({
      filters: filters,
      order: order,
      search: searchFormationEtablissement,
    });
  };

  return (
    <>
      <FiltersSection setSearchParams={setSearchParams} searchParams={searchParams} filtersLists={data?.filters} />
      <Flex direction="column" flex={1} position="relative" minH="0">
        {isFetching && (
          <Center height="100%" width="100%" position="absolute" bg="rgb(255,255,255,0.8)" zIndex="1">
            <Spinner />
          </Center>
        )}
        <TableHeader
          SearchInput={
            <SearchInput
              placeholder="Rechercher un établissement, un domaine, une commune..."
              onChange={setSearchFormationEtablissement}
              value={searchFormationEtablissement}
              onClick={onClickSearch}
            />
          }
          ColonneFilter={
            <ColonneFiltersSection
              colonneFilters={colonneFilters}
              handleColonneFilters={handleColonneFilters}
              forcedColonnes={["libelleEtablissement", "libelleFormation"]}
              trackEvent={trackEvent}
            />
          }
          onExportCsv={async () => onExportCsv()}
          onExportExcel={async () => onExportExcel()}
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
        <ConsoleSection
          data={data}
          filters={filters}
          order={order}
          setSearchParams={setSearchParams}
          colonneFilters={colonneFilters}
        />
      </Flex>
    </>
  );
}
