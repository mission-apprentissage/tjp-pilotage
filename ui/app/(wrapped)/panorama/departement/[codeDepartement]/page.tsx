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
  params: { codeDepartement },
}: {
  params: {
    codeDepartement: string;
  };
}) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: Partial<FiltersPanoramaFormation> = qs.parse(
    queryParams.toString()
  );

  const setSearchParams = (params: FiltersPanoramaFormation) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const handleOrder = (column: OrderPanoramaFormation["orderBy"]) => {
    if (searchParams.orderBy !== column) {
      setSearchParams({
        codeDepartement,
        ...searchParams,
        order: "desc",
        orderBy: column,
      });
      return;
    }
    setSearchParams({
      codeDepartement,
      ...searchParams,
      order: searchParams.order === "asc" ? "desc" : "asc",
      orderBy: column,
    });
  };

  const handleFilters = (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => {
    setSearchParams({ codeDepartement, ...searchParams, [type]: value });
  };

  const onCodeDepartementChanged = (codeDepartement: string) => {
    router.push(`/panorama/departement/${codeDepartement}`);
  };

  const { data: departementsOptions } = client
    .ref("[GET]/departements")
    .useQuery(
      {},
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data: stats } = client
    .ref("[GET]/departement/:codeDepartement")
    .useQuery(
      {
        params: { codeDepartement },
        query: { ...searchParams },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data, isLoading } = client
    .ref("[GET]/panorama/stats/departement")
    .useQuery(
      {
        query: {
          codeDepartement,
          ...searchParams,
        },
      },
      { keepPreviousData: true, staleTime: 10000000 }
    );

  useEffect(() => {
    const defaultDiplome = data?.filters.diplomes[0].value;
    if (defaultDiplome && defaultDiplome && !searchParams.codeNiveauDiplome) {
      handleFilters(
        "codeNiveauDiplome",
        defaultDiplome ? [defaultDiplome] : undefined
      );
    }
  }, [data]);

  return (
    <>
      <IndicateursSection
        onCodeChanged={onCodeDepartementChanged}
        code={codeDepartement}
        options={departementsOptions}
        stats={stats}
        handleFilters={handleFilters}
        activeFilters={searchParams}
        diplomeOptions={data?.filters.diplomes}
        typeTerritoire="departement"
      />
      <FiltersSection
        activeFilters={searchParams}
        handleFilters={handleFilters}
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
      <InfoSection
        codeRegion={stats?.codeRegion}
        codeDepartement={codeDepartement}
      />
    </>
  );
}
