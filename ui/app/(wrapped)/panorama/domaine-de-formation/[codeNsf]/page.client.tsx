"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import type { ScopeZone } from "shared";
import { ScopeEnum } from "shared";

import { client } from "@/api.client";

import { FiltersSection } from "./components/FiltersSection/FiltersSection";
import { FormationSection } from "./components/FormationSection";
import { HeaderSection } from "./components/HeaderSection/HeaderSection";
import { LiensUtilesSection } from "./components/LiensUtilesSection/LiensUtilesSection";
import { DomaineDeFormationProvider } from "./context/domaineDeFormationContext";
import { FormationContextProvider } from "./context/formationContext";
import { NsfContextProvider } from "./context/nsfContext";
import type { Academie, Departement, DomaineDeFormationResult, NsfOption, NsfOptions, Region } from "./types";
import { useDomaineDeFormationSearchParams } from "./useDomaineDeFormationSearchParams";

const defineScope = (
  codeRegion: string | undefined,
  codeAcademie: string | undefined,
  codeDepartement: string | undefined
): ScopeZone => {
  if (codeDepartement) {
    return ScopeEnum.département;
  }

  if (codeAcademie) {
    return ScopeEnum.académie;
  }

  if (codeRegion) {
    return ScopeEnum.région;
  }

  return ScopeEnum.national;
};

export function DomaineDeFormationClient(
  { defaultNsfs, nsf }:
  { defaultNsfs: NsfOptions, nsf: NsfOption }) {
  const { value: codeNsf } = nsf;
  const [domaineDeFormation, setDomaineDeFormation] = useState<DomaineDeFormationResult>({
    filters: {
      regions: [],
      academies: [],
      departements: [],
    },
    formations: [],
    libelleNsf: "",
    codeNsf: "",
  });
  const [scope, setScope] = useState<ScopeZone>(ScopeEnum.national);
  const [regions, setRegions] = useState<Region[]>();
  const [academies, setAcademies] = useState<Academie[]>();
  const [departements, setDepartements] = useState<Departement[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { codeRegion, codeAcademie, codeDepartement } = useDomaineDeFormationSearchParams();

  const libelleNsf = defaultNsfs.find((nsf) => nsf.value === codeNsf)?.label ?? "";

  const { isLoading: isDomaineDeFormationLoading, data: results } = client
    .ref("[GET]/domaine-de-formation/:codeNsf")
    .useQuery({ params: { codeNsf }, query: {
      codeRegion,
      codeAcademie,
      codeDepartement,
    }});

  useEffect(() => {
    if (results) {
      setDomaineDeFormation(results);
    }
  }, [results]);

  useEffect(() => {
    setIsLoading(isDomaineDeFormationLoading);
  }, [isDomaineDeFormationLoading]);

  // Initialize filters
  useEffect(() => {
    if (domaineDeFormation) {
      if (codeRegion) {
        setAcademies(domaineDeFormation.filters.academies.filter((academie) => academie.codeRegion === codeRegion));
        if (codeAcademie) {
          setDepartements(
            domaineDeFormation.filters.departements.filter((departement) => departement.codeAcademie === codeAcademie)
          );
        } else {
          setDepartements(
            domaineDeFormation.filters.departements.filter((departement) => departement.codeRegion === codeRegion)
          );
        }
      } else {
        setRegions(domaineDeFormation.filters.regions);
        setAcademies(domaineDeFormation.filters.academies);
        setDepartements(domaineDeFormation.filters.departements);
      }

      setScope(defineScope(codeRegion, codeAcademie, codeDepartement));
    }
  }, [codeRegion, codeAcademie, domaineDeFormation, codeDepartement]);

  if (!isDomaineDeFormationLoading && !results) {
    return redirect(`/panorama/domaine-de-formation?wrongNsf=${codeNsf}`);
  }

  return (
    <NsfContextProvider value={{ codeNsf, libelleNsf, defaultNsfs }}>
      <DomaineDeFormationProvider
        value={{
          domaineDeFormation,
          setDomaineDeFormation,
          isLoading,
          setIsLoading
        }}
      >
        <FormationContextProvider value={{
          scope,
          setScope,
          departements,
          setDepartements,
          academies,
          setAcademies,
          regions,
          setRegions
        }}>
          <HeaderSection />
          <FiltersSection />
          <FormationSection />
          <LiensUtilesSection />
        </FormationContextProvider>
      </DomaineDeFormationProvider>
    </NsfContextProvider>
  );
}
