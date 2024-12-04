"use client";

import { createContext, useContext } from "react";
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
  defaultCfd: string;
};

export const FormationContext = createContext<FormationContextType>({} as FormationContextType);

export function FormationContextProvider({ children, value, defaultCfd }: FormationContextProps) {
  const [currentFilters, setCurrentFilters] = useStateParams<Filters>({
    defaultValues: {
      presence: "",
      voie: "",
      formationTab: "indicateurs",
      cfd: defaultCfd,
      etab: {
        includeAll: true,
        view: "map",
        orderBy: "departement_commune",
      },
    },
  });

  const resetFilters = () => {
    setCurrentFilters((prev) => ({
      ...prev,
      codeRegion: "",
      codeDepartement: "",
      codeAcademie: "",
    }));
  };

  const handleRegionChange = (codeRegion: string) =>
    setCurrentFilters((prev) => ({
      ...prev,
      codeRegion,
      codeDepartement: "",
      codeAcademie: "",
      etab: {
        ...prev.etab,
        bbox: undefined,
      },
    }));

  const handleAcademieChange = (codeAcademie: string) => {
    const academie = value.academies.find((a) => a.value === codeAcademie);

    if (academie) {
      setCurrentFilters((prev) => ({
        ...prev,
        codeRegion: academie.codeRegion,
        codeAcademie,
        codeDepartement: "",
        etab: {
          ...prev.etab,
          bbox: undefined,
        },
      }));
    } else {
      setCurrentFilters((prev) => ({
        ...prev,
        codeAcademie: "",
        codeDepartement: "",
        etab: {
          ...prev.etab,
          bbox: undefined,
        },
      }));
    }
  };

  const handleDepartementChange = (codeDepartement: string) => {
    const departement = value.departements.find((d) => d.value === codeDepartement);

    if (departement) {
      setCurrentFilters((prev) => ({
        ...prev,
        codeRegion: departement.codeRegion,
        codeAcademie: departement.codeAcademie,
        codeDepartement,
        etab: {
          ...prev.etab,
          bbox: undefined,
        },
      }));
    } else {
      setCurrentFilters((prev) => ({
        ...prev,
        codeDepartement: "",
        etab: {
          ...prev.etab,
          bbox: undefined,
        },
      }));
    }
  };

  const handlePresenceChange = (presence: Presence) => {
    setCurrentFilters((prev) => ({
      ...prev,
      presence,
    }));
  };

  const handleVoieChange = (voie: Voie) => {
    setCurrentFilters((prev) => ({
      ...prev,
      voie,
    }));
  };

  const handleTabFormationChange = (formationTab: FormationTab) => {
    setCurrentFilters((prev) => ({
      ...prev,
      formationTab,
    }));
  };

  const handleIncludeAllChange = (includeAll: boolean) => {
    setCurrentFilters((prev) => ({
      ...prev,
      etab: { ...prev.etab, includeAll },
    }));
  };

  const handleViewChange = (view: EtablissementsView) => {
    setCurrentFilters((prev) => ({
      ...prev,
      etab: { ...prev.etab, view },
    }));
  };

  const handleOrderByChange = (orderBy: EtablissementsOrderBy) => {
    setCurrentFilters((prev) => ({
      ...prev,
      etab: { ...prev.etab, orderBy },
    }));
  };

  const handleChangeCfd = (cfd: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      cfd,
    }));
  };

  const handleClearBbox = () => {
    setCurrentFilters((prev) => ({
      ...prev,
      etab: { ...prev.etab, bbox: undefined },
    }));
  };

  const handleSetBbox = (bbox?: Bbox) => {
    setCurrentFilters((prev) => ({
      ...prev,
      etab: { ...prev.etab, bbox },
    }));
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

  return <FormationContext.Provider value={context}>{children}</FormationContext.Provider>;
}

export const useFormationContext = () => useContext(FormationContext);
