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
import { OrderPanoramaFormation } from "../../types";

export default function Panorama({
  params: { codeDepartement },
}: {
  params: {
    codeDepartement: string;
  };
}) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    order?: Partial<OrderPanoramaFormation>;
  } = qs.parse(queryParams.toString());

  const setSearchParams = (params: { order?: typeof order }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const handleOrder = (column: OrderPanoramaFormation["orderBy"]) => {
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

  const onCodeDepartementChanged = (codeDepartement: string) => {
    router.push(`/panorama/departement/${codeDepartement}`);
  };
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();
  const [libelleFiliere, setLibelleFiliere] = useState<string[]>();

  const { data: departementsOptions } = useQuery(
    ["departements"],
    api.getDepartements({}).call,
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data: stats } = useQuery(
    ["departement", codeDepartement, codeNiveauDiplome],
    api.getDepartementStats({
      params: { codeDepartement },
      query: { codeDiplome: codeNiveauDiplome },
    }).call,
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data } = useQuery(
    ["formationForPanorama", codeDepartement, order],
    api.getDataForPanoramaDepartement({
      query: {
        codeDepartement,
        ...order,
      },
    }).call,
    { keepPreviousData: true, staleTime: 10000000 }
  );

  return (
    <>
      <IndicateursSection
        onCodeChanged={onCodeDepartementChanged}
        code={codeDepartement}
        options={departementsOptions}
        stats={stats}
        onDiplomeChanged={setCodeNiveauDiplome}
        formations={data?.formations}
        codeDiplome={codeNiveauDiplome}
        typeTerritoire="departement"
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
        handleOrder={(column?: string) =>
          handleOrder(column as OrderPanoramaFormation["orderBy"])
        }
      />
      <TopFlopSection
        libelleFiliere={libelleFiliere}
        codeNiveauDiplome={codeNiveauDiplome}
        quadrantFormations={data?.formations}
      />
      <InfoSection
        codeRegion={stats?.codeRegion}
        codeDepartement={codeDepartement}
      />
    </>
  );
}
