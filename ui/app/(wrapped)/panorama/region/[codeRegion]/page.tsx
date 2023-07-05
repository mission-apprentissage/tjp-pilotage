"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../../../../api.client";
import { InfoSection } from "../../components/InfoSection";
import { CadranSection } from "./CadranSection";
import { FiltersSection } from "./FiltersSection";
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
    ["region", codeRegion],
    api.getRegionStats({ params: { codeRegion } }).call,
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

  return (
    <>
      <RegionSection
        onCodeRegionChanged={onCodeRegionChanged}
        codeRegion={codeRegion}
        regionOptions={regionOptions}
        stats={stats}
      />
      <FiltersSection
        onDiplomeChanged={setCodeNiveauDiplome}
        formations={data?.formations}
        codeDiplome={codeNiveauDiplome}
        libelleFiliere={libelleFiliere}
        onLibelleFiliereChanged={setLibelleFiliere}
      />
      <CadranSection
        codeNiveauDiplome={codeNiveauDiplome}
        libelleFiliere={libelleFiliere}
        meanInsertion={stats?.tauxInsertion6mois}
        meanPoursuite={stats?.tauxPoursuiteEtudes}
        cadranFormations={data?.formations}
      />
      <TopFlopSection
        libelleFiliere={libelleFiliere}
        codeNiveauDiplome={codeNiveauDiplome}
        cadranFormations={data?.formations}
      />
      <InfoSection codeRegion={codeRegion} />
    </>
  );
}
