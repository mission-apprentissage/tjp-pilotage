"use client";

import { createContext, useContext, useState } from "react";
import type { ScopeZone } from "shared";

import type {
  Academie,
  Bbox,
  Departement,
  EtablissementsOrderBy,
  EtablissementsView,
  Filters,
  FormationTab,
  Presence,
  Region,
  Voie,
} from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { useStateParams } from "@/utils/useFilters";

type InputFormationContextType = {
  codeNsf: string;
  scope: ScopeZone;
  regions: Region[];
  academies: Academie[];
  departements: Departement[];
};

type FormationContextType = InputFormationContextType & {
  currentFilters: Filters;
  resetFilters: () => void;
  handleRegionChange: (codeRegion: string) => void;
  handleAcademieChange: (codeAcademie: string) => void;
  handleDepartementChange: (codeDepartement: string) => void;
  handlePresenceChange: (presence: Presence) => void;
  handleVoieChange: (voie: Voie) => void;
  handleTabFormationChange: (formationTab: FormationTab) => void;
  handleIncludeAllChange: (includeAll: boolean) => void;
  handleViewChange: (view: EtablissementsView) => void;
  handleOrderByChange: (orderBy: EtablissementsOrderBy) => void;
  handleChangeCfd: (cfd: string) => void;
  handleClearBbox: () => void;
  handleSetBbox: (bbox?: Bbox) => void;
};

type FormationContextProps = {
  children: React.ReactNode;
  value: InputFormationContextType;
  cfd: string;
};

export const FormationContext = createContext<FormationContextType>({} as FormationContextType);

export function FormationContextProvider({ children, value, cfd }: FormationContextProps) {
  const [selectedCfd, setSelectedCfd] = useState(cfd);
  const [currentFilters, setCurrentFilters] = useStateParams<Filters>({
    defaultValues: {
      presence: "",
      voie: "",
      formationTab: "indicateurs",
      cfd,
      etab: {
        includeAll: true,
        view: "map",
        orderBy: "departement_commune",
      },
    },
  });

  const resetFilters = () =>
    setCurrentFilters({
      ...currentFilters,
      codeRegion: "",
      codeDepartement: "",
      codeAcademie: "",
    });

  const handleRegionChange = (codeRegion: string) =>
    setCurrentFilters({
      ...currentFilters,
      codeRegion,
      codeDepartement: "",
      codeAcademie: "",
    });

  const handleAcademieChange = (codeAcademie: string) => {
    const academie = value.academies.find((a) => a.value === codeAcademie);

    if (academie) {
      setCurrentFilters({
        ...currentFilters,
        codeRegion: academie.codeRegion,
        codeAcademie,
        codeDepartement: "",
      });
    } else {
      setCurrentFilters({
        ...currentFilters,
        codeAcademie: "",
        codeDepartement: "",
      });
    }
  };

  const handleDepartementChange = (codeDepartement: string) => {
    const departement = value.departements.find((d) => d.value === codeDepartement);

    if (departement) {
      setCurrentFilters({
        ...currentFilters,
        codeRegion: departement.codeRegion,
        codeAcademie: departement.codeAcademie,
        codeDepartement,
      });
    } else {
      setCurrentFilters({
        ...currentFilters,
        codeDepartement: "",
      });
    }
  };

  const handlePresenceChange = (presence: Presence) => {
    setCurrentFilters({ ...currentFilters, presence });
  };

  const handleVoieChange = (voie: Voie) => {
    setCurrentFilters({ ...currentFilters, voie });
  };

  const handleTabFormationChange = (formationTab: FormationTab) => {
    setCurrentFilters({ ...currentFilters, formationTab });
  };

  const handleIncludeAllChange = (includeAll: boolean) => {
    setCurrentFilters({ ...currentFilters, etab: { ...currentFilters.etab, includeAll } });
  };

  const handleViewChange = (view: EtablissementsView) => {
    setCurrentFilters({ ...currentFilters, etab: { ...currentFilters.etab, view } });
  };

  const handleOrderByChange = (orderBy: EtablissementsOrderBy) => {
    setCurrentFilters({ ...currentFilters, etab: { ...currentFilters.etab, orderBy } });
  };

  const handleChangeCfd = (cfd: string) => {
    console.log(`change cfd from ${currentFilters.cfd} to ${cfd}`);
    setSelectedCfd(cfd);
    setCurrentFilters({ ...currentFilters, cfd });
  };

  const handleClearBbox = () => {
    setCurrentFilters({ ...currentFilters, etab: { ...currentFilters.etab, bbox: undefined } });
  };

  const handleSetBbox = (bbox?: Bbox) => {
    setCurrentFilters({ ...currentFilters, etab: { ...currentFilters.etab, bbox } });
  };

  const context = {
    currentFilters,
    resetFilters,
    handleRegionChange,
    handleAcademieChange,
    handleDepartementChange,
    handlePresenceChange,
    handleVoieChange,
    handleTabFormationChange,
    handleIncludeAllChange,
    handleViewChange,
    handleOrderByChange,
    handleChangeCfd,
    handleClearBbox,
    scope: value.scope,
    codeNsf: value.codeNsf,
    regions: value.regions,
    academies: value.academies,
    departements: value.departements,
    handleSetBbox,
  };

  console.log(`cfd passed as props: ${cfd}, cfd in context: ${context.currentFilters.cfd}`);
  console.log({ selectedCfd });

  return <FormationContext.Provider value={context}>{children}</FormationContext.Provider>;
}

export const useFormationContext = () => useContext(FormationContext);
