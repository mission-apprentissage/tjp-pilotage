"use client";

import {Button, chakra, Container, Flex, MenuButton} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import * as qs from "qs";
import { useContext, useEffect, useState } from "react";
import { PREVIOUS_ANNEE_CAMPAGNE } from "shared/time/PREVIOUS_ANNEE_CAMPAGNE";

import { client } from "@/api.client";
import { CodeDepartementFilterContext, CodeRegionFilterContext } from "@/app/layoutClient";
import { GroupedMultiselect } from "@/components/GroupedMultiselect";
import { Loading } from "@/components/Loading";
import { SearchInput } from "@/components/SearchInput";
import { TableHeader } from "@/components/TableHeader";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { feature } from "@/utils/feature";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import type { CORRECTIONS_COLUMNS_OPTIONAL } from "./CORRECTIONS_COLUMN";
import { CORRECTIONS_COLUMNS, CORRECTIONS_COLUMNS_DEFAULT } from "./CORRECTIONS_COLUMN";
import { GROUPED_CORRECTIONS_COLUMNS } from "./GROUPED_CORRECTIONS_COLUMN";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import type { FiltersCorrections, OrderCorrections } from "./types";

const ColonneFiltersSection = chakra(
  ({
    colonneFilters,
    handleColonneFilters,
  }: {
    colonneFilters: (keyof typeof CORRECTIONS_COLUMNS_OPTIONAL)[];
    handleColonneFilters: (value: (keyof typeof CORRECTIONS_COLUMNS_OPTIONAL)[]) => void;
  }) => {
    return (
      <Flex justifyContent={"start"} direction="row">
        <GroupedMultiselect
          width={"48"}
          size="md"
          variant={"newInput"}
          onChange={(selected) => handleColonneFilters(selected as (keyof typeof CORRECTIONS_COLUMNS_OPTIONAL)[])}
          groupedOptions={Object.entries(GROUPED_CORRECTIONS_COLUMNS).reduce(
            (acc, [group, { color, options }]) => {
              acc[group] = {
                color,
                options: Object.entries(options).map(([value, label]) => ({
                  label,
                  value,
                })),
              };
              return acc;
            },
            {} as Record<string, { color: string; options: { label: string; value: string }[] }>
          )}
          defaultOptions={Object.entries(CORRECTIONS_COLUMNS_DEFAULT)?.map(([value, label]) => {
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
const EXPORT_LIMIT = 1_000_000;

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<FiltersCorrections>;
    columns?: (keyof typeof CORRECTIONS_COLUMNS_OPTIONAL)[];
    order?: Partial<OrderCorrections>;
    page?: string;
    search?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

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

  const { codeRegionFilter, setCodeRegionFilter } = useContext(CodeRegionFilterContext);

  const { codeDepartementFilter, setCodeDepartementFilter } = useContext(CodeDepartementFilterContext);

  const [campagneFilter, setCampagneFilter] = useState<string>(PREVIOUS_ANNEE_CAMPAGNE);

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof FiltersCorrections) => () => {
    trackEvent("restitution-correction:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: OrderCorrections["orderBy"]) => {
    trackEvent("restitution-correction:ordre", { props: { colonne: column } });
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
    type: keyof FiltersCorrections,
    value: FiltersCorrections[keyof FiltersCorrections]
  ) => {
    if (value != null)
      switch (type) {
      case "codeRegion":
        setCodeRegionFilter((value as string[])[0] ?? "");
        break;
      case "codeDepartement":
        setCodeDepartementFilter((value as string[])[0] ?? "");
        break;
      case "campagne":
        setCampagneFilter((value as string[])[0] ?? "");
        break;
      }
  };

  const handleFilters = (type: keyof FiltersCorrections, value: FiltersCorrections[keyof FiltersCorrections]) => {
    handleDefaultFilters(type, value);
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const handleColonneFilters = (value: (keyof typeof CORRECTIONS_COLUMNS_OPTIONAL)[]) => {
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
        statut: undefined,
        typeDemande: [],
        voie: undefined,
        coloration: undefined,
        amiCMA: undefined,
      },
      search: "",
    });
  };

  const getCorrectionsQueryParameters = (qLimit: number, qOffset?: number) => ({
    ...filters,
    ...order,
    search,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/corrections").useQuery(
    {
      query: getCorrectionsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const [colonneFilters, setColonneFilters] = useState<(keyof typeof CORRECTIONS_COLUMNS_OPTIONAL)[]>(
    (columns.length
      ? columns
      : Object.keys(CORRECTIONS_COLUMNS_DEFAULT)) as (keyof typeof CORRECTIONS_COLUMNS_DEFAULT)[]
  );

  const [searchIntention, setSearchIntention] = useState<string>(search);

  const setDefaultFilters = () => {
    if (
      filters?.codeRegion === undefined &&
      filters?.codeAcademie === undefined &&
      filters?.codeDepartement === undefined &&
      codeRegionFilter
    ) {
      filters.codeRegion = [codeRegionFilter];
    }
    if (
      filters?.codeRegion === undefined &&
      filters?.codeAcademie === undefined &&
      filters?.codeDepartement === undefined &&
      codeDepartementFilter
    ) {
      filters.codeDepartement = [codeDepartementFilter];
    }
    if (filters?.campagne === undefined && campagneFilter !== "") {
      filters.campagne = campagneFilter;
    }
    setSearchParams({ filters: filters });
  };

  useEffect(() => {
    setDefaultFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSearch = () => {
    setSearchParams({
      filters: filters,
      order: order,
      search: searchIntention,
    });
  };

  useEffect(() => {
    const campagneFilterNumber = parseInt(searchParams.filters?.campagne ?? "");
    handleFilters("rentreeScolaire", campagneFilterNumber + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.filters?.campagne]);

  if (!feature.correction) {
    router.replace("/");
    return <Loading />;
  }

  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("restitution-correction:export");
    const data = await client.ref("[GET]/corrections").query({
      query: isFiltered ? getCorrectionsQueryParameters(EXPORT_LIMIT) : { limit: EXPORT_LIMIT },
    });
    downloadCsv(
      "corrections_export",
      data.corrections.map((correction) => ({
        ...correction,
        createdAt: new Date(correction.createdAt).toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedAt: new Date(correction.updatedAt).toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        secteur: correction.secteur === "PU" ? "Public" : "Privé",
      })),
      CORRECTIONS_COLUMNS
    );
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("restitution-correction:export-excel");
    const data = await client.ref("[GET]/corrections").query({
      query: isFiltered ? getCorrectionsQueryParameters(EXPORT_LIMIT) : { limit: EXPORT_LIMIT },
    });
    downloadExcel(
      "corrections_export",
      data.corrections.map((correction) => ({
        ...correction,
        createdAt: new Date(correction.createdAt).toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedAt: new Date(correction.updatedAt).toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        secteur: correction.secteur === "PU" ? "Public" : "Privé",
      })),
      CORRECTIONS_COLUMNS
    );
  };

  return (
    <GuardPermission permission="restitution-intentions/lecture">
      <Container maxWidth={"100%"} pt={8} bg="blueecume.925" pb={20} flex={1}>
        <HeaderSection
          countData={data?.stats}
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          resetFilters={resetFilters}
          isLoading={isLoading}
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
            <ColonneFiltersSection colonneFilters={colonneFilters} handleColonneFilters={handleColonneFilters} />
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
        />
      </Container>
    </GuardPermission>
  );
};
