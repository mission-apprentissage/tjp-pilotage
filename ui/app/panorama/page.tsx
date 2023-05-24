"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { InfoSection } from "@/app/panorama/InfoSection";

import { api } from "../../api.client";
import { CadranSection } from "./CadranSection";
import { RegionSection } from "./RegionSection";

export default function Panorama() {
  const [codeRegion, setCodeRegion] = useState("84");

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
      />
      <CadranSection
        diplomeOptions={filters?.filters.diplomes}
        codeRegion={codeRegion}
      />
      <InfoSection codeRegion={codeRegion} />
    </>
  );
}
