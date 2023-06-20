"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../../../api.client";
import { InfoSection } from "../../components/InfoSection";
import { PanoramaSelection } from "../PanoramaSelection";
import { CadranSection } from "./CadranSection";
import { EtablissementSection } from "./EtablissementSection";
import { FiltersSection } from "./FiltersSection";
import { FormationsSection } from "./FormationsSection";
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
    router.push(`/panorama/etablissement/${uai}`);
  };
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();

  const { data: etablissement, isError } = useQuery(
    ["getEtablissement", { uai }],
    api.getEtablissement({
      params: { uai },
    }).call,
    { keepPreviousData: true, staleTime: 10000000, retry: false }
  );

  const { data: regionStats } = useQuery(
    ["getRegionStats", { codeRegion: etablissement?.codeRegion }],
    api.getRegionStats({
      params: { codeRegion: etablissement?.codeRegion as string },
    }).call,
    { keepPreviousData: true, staleTime: 10000000, enabled: !!etablissement }
  );

  const diplomeOptions = Object.values(
    etablissement?.formations.reduce((acc, cur) => {
      if (!cur.libelleNiveauDiplome) return acc;
      return {
        ...acc,
        [cur.codeNiveauDiplome]: {
          value: cur.codeNiveauDiplome,
          label: cur.libelleNiveauDiplome,
        },
      };
    }, {} as Record<string, { value: string; label: string }>) ?? {}
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
      />
      <RegionSection regionsStats={regionStats} />
      <CadranSection
        rentreeScolaire={etablissement?.rentreeScolaire}
        codeNiveauDiplome={codeNiveauDiplome}
        meanInsertion={regionStats?.tauxInsertion12mois}
        meanPoursuite={regionStats?.tauxPoursuiteEtudes}
        cadranFormations={etablissement?.formations}
      />
      <FormationsSection
        rentreeScolaire={etablissement?.rentreeScolaire}
        formations={etablissement?.formations}
      />
      <InfoSection codeRegion={etablissement?.codeRegion} />
    </>
  );
}
