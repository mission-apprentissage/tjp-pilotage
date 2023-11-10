"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useContext, useState } from "react";

import { api } from "../../../../../api.client";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { UaiFilterContext } from "../../../../layoutClient";
import { InfoSection } from "../../components/InfoSection";
import { OrderPanoramaEtablissement } from "../../types";
import { PanoramaSelection } from "../PanoramaSelection";
import { EtablissementSection } from "./EtablissementSection";
import { FiltersSection } from "./FiltersSection";
import { FormationsSection } from "./FormationsSection";
import { QuadrantSection } from "./QuadrantSection";
import { RegionSection } from "./RegionSection";

export default function Panorama({
  params: { uai },
}: {
  params: {
    uai: string;
  };
}) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    order?: Partial<OrderPanoramaEtablissement>;
  } = qs.parse(queryParams.toString());

  const setSearchParams = (params: { order?: typeof order }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const handleOrder = (column: OrderPanoramaEtablissement["orderBy"]) => {
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
  const { setUaiFilter } = useContext(UaiFilterContext);

  const onUaiChanged = (uai: string) => {
    setUaiFilter(uai);
    router.push(`/panorama/etablissement/${uai}`);
  };
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();

  const { data: etablissement, isError } = useQuery(
    ["getEtablissement", uai, order],
    api.getEtablissement({
      query: {
        uai,
        ...order,
      },
    }).call,
    { keepPreviousData: true, staleTime: 10000000, retry: false }
  );

  const { data: regionStats } = useQuery(
    ["getRegionStats", { codeRegion: etablissement?.codeRegion }],
    api.getRegionStats({
      params: { codeRegion: etablissement?.codeRegion as string },
      query: {},
    }).call,
    { keepPreviousData: true, staleTime: 10000000, enabled: !!etablissement }
  );

  const diplomeOptions = Object.values(
    etablissement?.formations.reduce(
      (acc, cur) => {
        if (!cur.libelleNiveauDiplome) return acc;
        return {
          ...acc,
          [cur.codeNiveauDiplome]: {
            value: cur.codeNiveauDiplome,
            label: cur.libelleNiveauDiplome,
          },
        };
      },
      {} as Record<string, { value: string; label: string }>
    ) ?? {}
  );

  if (isError) {
    return (
      <>
        <PanoramaSelection wrongUai={uai} />
      </>
    );
  }

  return (
    <>
      <EtablissementSection
        uai={uai}
        etablissement={etablissement}
        onUaiChanged={onUaiChanged}
      />
      <FiltersSection
        onDiplomeChanged={setCodeNiveauDiplome}
        diplomeOptions={diplomeOptions}
        codeDiplome={codeNiveauDiplome}
      />
      <RegionSection regionsStats={regionStats} />
      <QuadrantSection
        rentreeScolaire={etablissement?.rentreeScolaire}
        codeNiveauDiplome={codeNiveauDiplome}
        meanInsertion={regionStats?.tauxInsertion}
        meanPoursuite={regionStats?.tauxPoursuite}
        quadrantFormations={etablissement?.formations}
        order={order}
        handleOrder={handleOrder}
      />
      <FormationsSection
        rentreeScolaire={etablissement?.rentreeScolaire}
        formations={etablissement?.formations}
      />
      <InfoSection codeRegion={etablissement?.codeRegion} />
    </>
  );
}
