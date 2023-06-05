"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../../api.client";
import { CadranSection } from "./CadranSection";
import { InfoSection } from "./InfoSection";
import { RegionSection } from "./RegionSection";
import { TopFlopSection } from "./TopFlopSection";

export default function Panorama() {
  const [codeRegion, setCodeRegion] = useState("84");
  const [UAI, setUAI] = useState<string[]>();

  const { data } = useQuery(
    ["formationForPanorama", { codeRegion, UAI }],
    api.getDataForPanorama({
      query: { codeRegion, UAI },
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
        onCodeRegionChanged={setCodeRegion}
        codeRegion={codeRegion}
        regionOptions={filters?.filters.regions}
        onUAIChanged={setUAI}
        UAIOptions={filters?.filters.etablissements}
        stats={data?.stats}
      />
      <CadranSection
        meanInsertion={data?.stats.tauxInsertion12mois}
        meanPoursuite={data?.stats.tauxPoursuiteEtudes}
        diplomeOptions={filters?.filters.diplomes}
        cadranFormations={data?.formations}
      />
      {!UAI?.length && (
        <TopFlopSection
          diplomeOptions={filters?.filters.diplomes}
          cadranFormations={data?.formations}
        />
      )}
      <InfoSection codeRegion={codeRegion} />
    </>
  );
}
