"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../../../api.client";
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

  const diplomeOptions = Object.values(
    data?.formations.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.codeNiveauDiplome]: {
          value: cur.codeNiveauDiplome,
          label: cur.libelleNiveauDiplome as string,
        },
      };
    }, {} as Record<string, { value: string; label: string }>) ?? {}
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
        diplomeOptions={diplomeOptions}
        codeDiplome={codeNiveauDiplome}
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
