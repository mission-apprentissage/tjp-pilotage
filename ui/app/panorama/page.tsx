"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { InfoSection } from "@/app/panorama/InfoSection";

import { api } from "../../api.client";
import { CadranSection } from "./CadranSection";
import { RegionSection } from "./RegionSection";
import { TopFlopSection } from "./TopFlopSection";

export default function Panorama() {
  const [codeRegion, setCodeRegion] = useState("84");
  const [UAI, setUAI] = useState<string[]>();

  const { data } = useQuery(
    ["formationForCadran", { codeRegion, UAI }],
    api.getRegionStatsForCadran({
      query: { codeRegion, UAI },
    }).call,
    { keepPreviousData: true, staleTime: 10000000 }
  );

  const { data: filters } = useQuery(
    ["filtersForCadran", { codeRegion }],
    api.getFiltersForCadran({ query: { codeRegion } }).call,
    { keepPreviousData: true, staleTime: 1000000000 }
  );

  return (
    <>
      <RegionSection
        onCodeRegionChanged={setCodeRegion}
        codeRegion={codeRegion}
        regionOptions={filters?.filters.regions}
        onUAIChanged={setUAI}
        UAI={UAI}
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
