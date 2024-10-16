"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";

import { client } from "@/api.client";

import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { FiltersSection } from "../../components/FiltersSection";
import { IndicateursSection } from "../../components/IndicateursSection/IndicateursSection";
import { InfoSection } from "../../components/InfoSection";
import { QuadrantSection } from "../../components/QuadrantSection/QuadrantSection";
import { TauxInserJeunesSection } from "../../components/TauxInserJeunesSection/TauxInserJeunesSection";
import { TopFlopSection } from "../../components/TopFlopSection/TopFlopSection";
import { FiltersPanoramaFormation, OrderPanoramaFormation } from "../../types";

export default function Panorama({
  params: { codeRegion },
}: {
  readonly params: {
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
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => {
    setSearchParams({ ...searchParams, [type]: value });
  };

  const onCodeRegionChanged = (codeRegion: string) => {
    router.push(`/panorama/region/${codeRegion}?${qs.stringify(searchParams)}`);
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

  return (
    <>
      <FiltersSection
        onCodeChanged={onCodeRegionChanged}
        code={codeRegion}
        options={regionOptions}
        diplomeOptions={data?.filters.diplomes}
        handleFilters={handleFilters}
        activeFilters={searchParams}
        libelleNsfOptions={data?.filters.libellesNsf}
      />
      <IndicateursSection
        stats={
          searchParams.codeNsf
            ? {
                libelleRegion: stats?.libelleRegion,
                codeRegion,
                libelleDepartement: "",
              }
            : stats
        }
        libelleTerritoire={
          regionOptions?.find((item) => item.value === codeRegion)?.label
        }
        libelleDiplome={
          data?.filters.diplomes?.find(
            (item) => item.value === searchParams.codeNiveauDiplome?.[0]
          )?.label
        }
      />
      <TauxInserJeunesSection
        region={stats?.libelleRegion}
        tauxInsertion={data?.tauxInsertion}
        tauxPoursuite={data?.tauxPoursuite}
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
        codeRegion={codeRegion}
        codeNiveauDiplome={searchParams.codeNiveauDiplome?.[0]}
        codeNsf={searchParams.codeNsf?.[0]}
        nbFormationsTotal={stats?.nbFormations}
        effectifEntreeTotal={stats?.effectifEntree}
      />
      <TopFlopSection topFlops={data?.topFlops} isLoading={isLoading} />
      <InfoSection codeRegion={codeRegion} />
    </>
  );
}
