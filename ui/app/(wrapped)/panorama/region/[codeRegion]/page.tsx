"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";

import { api } from "../../../../../api.client";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { FiltersSection } from "../../components/FiltersSection";
import { IndicateursSection } from "../../components/IndicateursSection";
import { InfoSection } from "../../components/InfoSection";
import { QuadrantSection } from "../../components/QuadrantSection";
import { TopFlopSection } from "../../components/TopFlopSection";
import { FiltersPanoramaFormation, OrderPanoramaFormation } from "../../types";

export default function Panorama({
  params: { codeRegion },
}: {
  params: {
    codeRegion: string;
  };
}) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    order?: Partial<OrderPanoramaFormation>;
    filters?: Partial<FiltersPanoramaFormation>;
  } = qs.parse(queryParams.toString());

  const order = searchParams.order ?? { order: "asc" };
  const filters = searchParams.filters ?? {};

  const setSearchParams = (params: {
    order?: typeof order;
    filters?: typeof filters;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const handleOrder = (column: OrderPanoramaFormation["orderBy"]) => {
    if (order?.orderBy !== column) {
      setSearchParams({
        ...filters,
        order: { order: "desc", orderBy: column },
      });
      return;
    }
    setSearchParams({
      ...filters,
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const handleFilters = (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => {
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const onCodeRegionChanged = (codeRegion: string) => {
    router.push(`/panorama/region/${codeRegion}`);
  };

  const { data: regionOptions } = useQuery(
    ["regions"],
    api.getRegions({}).call,
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data: stats } = useQuery(
    ["region", codeRegion, filters],
    api.getRegionStats({
      params: { codeRegion },
      query: { ...filters },
    }).call,
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data, isLoading } = useQuery(
    ["formationForPanorama", codeRegion, order, filters],
    api.getDataForPanoramaRegion({
      query: {
        codeRegion,
        ...order,
        ...filters,
      },
    }).call,
    { keepPreviousData: true, staleTime: 10000000 }
  );

  return (
    <>
      <IndicateursSection
        onCodeChanged={onCodeRegionChanged}
        code={codeRegion}
        options={regionOptions}
        stats={stats}
        handleFilters={handleFilters}
        activeFilters={filters}
        diplomeOptions={data?.filters.diplomes}
      />
      <FiltersSection
        handleFilters={handleFilters}
        activeFilters={filters}
        libelleFiliereOptions={data?.filters.filieres}
      />
      <QuadrantSection
        meanInsertion={stats?.tauxInsertion}
        meanPoursuite={stats?.tauxPoursuite}
        quadrantFormations={data?.formations}
        isLoading={isLoading}
        order={order}
        handleOrder={(column?: string) =>
          handleOrder(column as OrderPanoramaFormation["orderBy"])
        }
      />
      <TopFlopSection
        quadrantFormations={data?.formations}
        isLoading={isLoading}
      />
      <InfoSection codeRegion={codeRegion} />
    </>
  );
}
