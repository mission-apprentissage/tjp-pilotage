"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api, client } from "@/api.client";

import { CadranSection } from "../../components/CadranSection";
import { FiltersSection } from "../../components/FiltersSection";
import { IndicateursSection } from "../../components/IndicateursSection";
import { InfoSection } from "../../components/InfoSection";
import { TopFlopSection } from "../../components/TopFlopSection";

export default function Panorama({
  params: { codeDepartement },
}: {
  params: {
    codeDepartement: string;
  };
}) {
  const router = useRouter();

  const onCodeDepartementChanged = (codeDepartement: string) => {
    router.push(`/panorama/departement/${codeDepartement}`);
  };
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();
  const [libelleFiliere, setLibelleFiliere] = useState<string[]>();

  const { data: departementsOptions } = client
    .ref("[GET]/departements")
    .useQuery(
      {},
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data: stats } = client
    .ref("[GET]/departement/:codeDepartement")
    .useQuery(
      {
        params: { codeDepartement },
        query: { codeDiplome: codeNiveauDiplome },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data } = useQuery(
    ["formationForPanorama", { codeDepartement }],
    api.getDataForPanoramaDepartement({
      query: { codeDepartement },
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
      <InfoSection
        codeRegion={stats?.codeRegion}
        codeDepartement={codeDepartement}
      />
    </>
  );
}
