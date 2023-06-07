"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../../api.client";
import { CadranSection } from "./CadranSection";
import { FiltersSection } from "./FiltersSection";
import { InfoSection } from "./InfoSection";
import { RegionSection } from "./RegionSection";
import { TopFlopSection } from "./TopFlopSection";

export default function Panorama({
  params: { codeRegion },
}: {
  params: {
    codeRegion: string;
  };
}) {
  const router = useRouter();

  const onCodeRegionChanged = (codeRegion: string) => {
    router.push(`/panorama/${codeRegion}`);
  };
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();

  const { data: regionOptions } = useQuery(
    ["regions"],
    api.getRegions({}).call,
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data } = useQuery(
    ["formationForPanorama", { codeRegion }],
    api.getDataForPanorama({
      query: { codeRegion },
    }).call,
    { keepPreviousData: true, staleTime: 10000000 }
  );

  const { data: filters } = useQuery(
    ["filtersForPanorama", { codeRegion }],
    api.getFiltersForPanorama({ query: { codeRegion } }).call,
    { keepPreviousData: true, staleTime: 1000000000 }
  );

  return (
    <>
      <RegionSection
        onCodeRegionChanged={onCodeRegionChanged}
        codeRegion={codeRegion}
        regionOptions={regionOptions}
        stats={data?.stats}
      />
      <FiltersSection
        onDiplomeChanged={setCodeNiveauDiplome}
        diplomeOptions={filters?.filters.diplomes}
      />
      <CadranSection
        codeNiveauDiplome={codeNiveauDiplome}
        meanInsertion={data?.stats.tauxInsertion12mois}
        meanPoursuite={data?.stats.tauxPoursuiteEtudes}
        cadranFormations={data?.formations}
      />
      <TopFlopSection
        codeNiveauDiplome={codeNiveauDiplome}
        cadranFormations={data?.formations}
      />
      <InfoSection codeRegion={codeRegion} />
    </>
  );
}
