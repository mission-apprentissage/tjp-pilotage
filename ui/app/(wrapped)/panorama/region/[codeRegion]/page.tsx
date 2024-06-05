"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useEffect } from "react";

import { client } from "@/api.client";

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
  const searchParams: Partial<FiltersPanoramaFormation> = qs.parse(
    queryParams.toString()
  );

  const setSearchParams = (params: Partial<FiltersPanoramaFormation>) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const handleOrder = (column: OrderPanoramaFormation["orderBy"]) => {
    if (searchParams.orderBy !== column) {
      setSearchParams({
        codeRegion,
        ...searchParams,
        order: "desc",
        orderBy: column,
      });
      return;
    }
    setSearchParams({
      codeRegion,
      ...searchParams,
      order: searchParams.order === "asc" ? "desc" : "asc",
      orderBy: column,
    });
  };

  const handleFilters = (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => {
    setSearchParams({ codeRegion, ...searchParams, [type]: value });
  };

  const onCodeRegionChanged = (codeRegion: string) => {
    router.push(`/panorama/region/${codeRegion}`);
  };

  const { data: regionOptions } = client.ref("[GET]/regions").useQuery(
    {},
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data: stats } = client.ref("[GET]/region/:codeRegion").useQuery(
    {
      params: { codeRegion },
      query: { ...searchParams },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data, isLoading } = client
    .ref("[GET]/panorama/stats/region")
    .useQuery(
      {
        query: {
          codeRegion,
          ...searchParams,
        },
      },
      { keepPreviousData: true, staleTime: 10000000 }
    );

  useEffect(() => {
    const defaultDiplome = data?.filters.diplomes[0].value;

    if (defaultDiplome && !searchParams.codeNiveauDiplome) {
      handleFilters(
        "codeNiveauDiplome",
        defaultDiplome ? [defaultDiplome] : undefined
      );
    }
  }, [data]);

  return (
    <>
      <IndicateursSection
        onCodeChanged={onCodeRegionChanged}
        code={codeRegion}
        options={regionOptions}
        stats={stats}
        handleFilters={handleFilters}
        activeFilters={searchParams}
        diplomeOptions={data?.filters.diplomes}
      />
      <FiltersSection
        handleFilters={handleFilters}
        activeFilters={searchParams}
        libelleNsfOptions={data?.filters.libellesNsf}
      />
      <QuadrantSection
        meanInsertion={stats?.tauxInsertion}
        meanPoursuite={stats?.tauxPoursuite}
        quadrantFormations={data?.formations}
        isLoading={isLoading}
        order={{ order: searchParams.order, orderBy: searchParams.orderBy }}
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
