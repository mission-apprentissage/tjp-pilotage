"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useContext } from "react";

import { client } from "@/api.client";
import { FiltersSection } from "@/app/(wrapped)/panorama/components/FiltersSection";
import { IndicateursSection } from "@/app/(wrapped)/panorama/components/IndicateursSection/IndicateursSection";
import { InfoSection } from "@/app/(wrapped)/panorama/components/InfoSection";
import { QuadrantSection } from "@/app/(wrapped)/panorama/components/QuadrantSection/QuadrantSection";
import { TopFlopSection } from "@/app/(wrapped)/panorama/components/TopFlopSection/TopFlopSection";
import type { FiltersPanoramaFormation, OrderPanoramaFormation } from "@/app/(wrapped)/panorama/types";
import { CodeDepartementFilterContext } from "@/app/layoutClient";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

export default function Panorama({
  params: { codeDepartement },
}: {
  readonly params: {
    codeDepartement: string;
  };
}) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: Partial<FiltersPanoramaFormation> = qs.parse(queryParams.toString());
  const { setCodeDepartementFilter } = useContext(CodeDepartementFilterContext);

  const setSearchParams = (params: FiltersPanoramaFormation) => {
    router.replace(createParametrizedUrl(location.pathname, { ...searchParams, ...params }));
  };

  const handleOrder = (column: OrderPanoramaFormation["orderBy"]) => {
    if (searchParams.orderBy !== column) {
      setSearchParams({
        ...searchParams,
        order: "desc",
        orderBy: column,
      });
      return;
    }
    setSearchParams({
      ...searchParams,
      order: searchParams.order === "asc" ? "desc" : "asc",
      orderBy: column,
    });
  };

  const handleFilters = (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation],
  ) => {
    setSearchParams({ ...searchParams, [type]: value });
  };

  const onCodeDepartementChanged = (codeDepartement: string) => {
    setCodeDepartementFilter(codeDepartement);

    router.push(`/panorama/departement/${codeDepartement}?${qs.stringify(searchParams)}`);
  };

  const { data: departementsOptions } = client.ref("[GET]/departements").useQuery(
    {},
    {
      keepPreviousData: true,
      staleTime: 10000000,
    },
  );

  const { data: stats } = client.ref("[GET]/departement/:codeDepartement").useQuery(
    {
      params: { codeDepartement },
      query: { ...searchParams },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    },
  );

  const { data, isLoading } = client.ref("[GET]/panorama/stats/departement").useQuery(
    {
      query: {
        codeDepartement,
        ...searchParams,
      },
    },
    { keepPreviousData: true, staleTime: 10000000 },
  );

  return (
    <>
      <FiltersSection
        onCodeChanged={onCodeDepartementChanged}
        code={codeDepartement}
        options={departementsOptions}
        diplomeOptions={data?.filters.diplomes}
        handleFilters={handleFilters}
        activeFilters={searchParams}
        libelleNsfOptions={data?.filters.libellesNsf}
      />
      <IndicateursSection
        stats={
          searchParams.codeNsf
            ? {
                libelleRegion: "",
                codeRegion: "",
                libelleDepartement: stats?.libelleDepartement,
              }
            : stats
        }
        libelleTerritoire={departementsOptions?.find((item) => item.value === codeDepartement)?.label}
        libelleDiplome={
          data?.filters.diplomes?.find((item) => item.value === searchParams.codeNiveauDiplome?.[0])?.label
        }
        typeTerritoire={"departement"}
      />
      <QuadrantSection
        meanInsertion={stats?.tauxInsertion}
        meanPoursuite={stats?.tauxPoursuite}
        quadrantFormations={data?.formations}
        isLoading={isLoading}
        order={{ order: searchParams.order, orderBy: searchParams.orderBy }}
        handleOrder={(column?: string) => handleOrder(column as OrderPanoramaFormation["orderBy"])}
        codeRegion={stats?.codeRegion}
        codeDepartement={codeDepartement}
        codeNiveauDiplome={searchParams.codeNiveauDiplome?.[0]}
        codeNsf={searchParams.codeNsf?.[0]}
        nbFormationsTotal={stats?.nbFormations}
        effectifEntreeTotal={stats?.effectifEntree}
      />
      <TopFlopSection topFlops={data?.topFlops} isLoading={isLoading} />
      <InfoSection codeRegion={stats?.codeRegion} codeDepartement={codeDepartement} />
    </>
  );
}
