"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { client } from "@/api.client";

import { CadranSection } from "../../components/CadranSection";
import { FiltersSection } from "../../components/FiltersSection";
import { IndicateursSection } from "../../components/IndicateursSection";
import { InfoSection } from "../../components/InfoSection";
import { TopFlopSection } from "../../components/TopFlopSection";

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
      query: { codeDiplome: codeNiveauDiplome },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data } = client.ref("[GET]/panorama/stats/region").useQuery(
    {
      query: { codeRegion },
    },
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
