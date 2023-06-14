"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../../../api.client";
import { InfoSection } from "../../../components/InfoSection";
import { CadranSection } from "./CadranSection";
import { EtablissementSection } from "./EtablissementSection";
import { FiltersSection } from "./FiltersSection";
import { RegionSection } from "./RegionSection";

export default function Panorama({
  params: { uai },
}: {
  params: {
    uai: string;
  };
}) {
  const router = useRouter();

  const onUaiChanged = (uai: string) => {
    router.push(`/etablissement/${uai}`);
  };
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();

  const { data: etablissement } = useQuery(
    ["getEtablissement", { uai }],
    api.getEtablissement({
      params: { uai },
    }).call,
    { keepPreviousData: true, staleTime: 10000000 }
  );

  const { data } = useQuery(
    ["getDataForPanorama", { uai }],
    api.getDataForPanorama({
      query: { codeRegion: etablissement?.codeRegion as string, UAI: [uai] },
    }).call,
    { keepPreviousData: true, staleTime: 10000000, enabled: !!etablissement }
  );

  const { data: filters } = useQuery(
    ["filtersForPanorama", { uai }],
    api.getFiltersForPanorama({ query: { codeRegion: "84" } }).call,
    { keepPreviousData: true, staleTime: 1000000000 }
  );

  return (
    <>
      <EtablissementSection
        etablissement={etablissement}
        onUaiChanged={onUaiChanged}
      />
      <FiltersSection
        onDiplomeChanged={setCodeNiveauDiplome}
        diplomeOptions={filters?.filters.diplomes}
      />
      <RegionSection regionsStats={data?.stats} />
      <CadranSection
        codeNiveauDiplome={codeNiveauDiplome}
        meanInsertion={data?.stats.tauxInsertion12mois}
        meanPoursuite={data?.stats.tauxPoursuiteEtudes}
        cadranFormations={data?.formations}
      />
      <InfoSection codeRegion={"84"} />
    </>
  );
}
