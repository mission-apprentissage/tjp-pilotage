"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";

import { api } from "../../../../../api.client";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { FiltersSection } from "../../components/FiltersSection";
import { IndicateursSection } from "../../components/IndicateursSection";
import { InfoSection } from "../../components/InfoSection";
import { QuadrantSection } from "../../components/QuadrantSection";
import { TopFlopSection } from "../../components/TopFlopSection";
import { Order } from "../../types";

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
    order?: Partial<Order>;
  } = qs.parse(queryParams.toString());

  const setSearchParams = (params: { order?: typeof order }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const handleOrder = (column: Order["orderBy"]) => {
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

  const order = searchParams.order ?? { order: "asc" };

  const onCodeRegionChanged = (codeRegion: string) => {
    router.push(`/panorama/region/${codeRegion}`);
  };
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();
  const [libelleFiliere, setLibelleFiliere] = useState<string[]>();

  const { data: regionOptions } = useQuery(
    ["regions"],
    api.getRegions({}).call,
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data: stats } = useQuery(
    ["region", codeRegion, codeNiveauDiplome],
    api.getRegionStats({
      params: { codeRegion },
      query: { codeDiplome: codeNiveauDiplome },
    }).call,
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data } = useQuery(
    ["formationForPanorama", codeRegion, order],
    api.getDataForPanoramaRegion({
      query: {
        codeRegion,
        ...order,
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
        onDiplomeChanged={setCodeNiveauDiplome}
        formations={data?.formations}
        codeDiplome={codeNiveauDiplome}
      />
      <FiltersSection
        formations={data?.formations}
        libelleFiliere={libelleFiliere}
        onLibelleFiliereChanged={setLibelleFiliere}
      />
      <QuadrantSection
        codeNiveauDiplome={codeNiveauDiplome}
        libelleFiliere={libelleFiliere}
        meanInsertion={stats?.tauxInsertion}
        meanPoursuite={stats?.tauxPoursuite}
        quadrantFormations={data?.formations}
        order={order}
        handleOrder={handleOrder}
      />
      <TopFlopSection
        libelleFiliere={libelleFiliere}
        codeNiveauDiplome={codeNiveauDiplome}
        quadrantFormations={data?.formations}
      />
      <InfoSection codeRegion={codeRegion} />
    </>
  );
}
