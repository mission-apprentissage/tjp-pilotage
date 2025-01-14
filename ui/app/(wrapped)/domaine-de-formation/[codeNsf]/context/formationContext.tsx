"use client";

import { usePlausible } from "next-plausible";
import { createContext, useContext, useMemo } from "react";
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
  libelleNsf: string;
  scope: ScopeZone;
  regions: Region[];
  academies: Academie[];
  departements: Departement[];
};

type FormationContextType = InputFormationContextType & {
  currentFilters: Filters;
  handleResetFilters: () => void;
  handleRegionChange: (codeRegion: string) => void;
  handleAcademieChange: (codeAcademie: string) => void;
  handleDepartementChange: (codeDepartement: string) => void;
  handlePresenceChange: (presence: Presence) => void;
  handleVoieChange: (voie: Voie) => void;
  handleTabFormationChange: (formationTab: FormationTab) => void;
  handleIncludeAllChange: (includeAll: boolean) => void;
  handleViewChange: (view: EtablissementsView) => void;
  handleOrderByChange: (orderBy: EtablissementsOrderBy) => void;
  handleCfdChange: (cfd: string) => void;
  handleClearBbox: () => void;
  handleSetBbox: (bbox?: Bbox) => void;
};

type FormationContextProps = {
  children: React.ReactNode;
  value: InputFormationContextType;
  defaultCfd: string;
};

export const FormationContext = createContext<FormationContextType>({} as FormationContextType);

export function FormationContextProvider({ children, value, defaultCfd }: Readonly<FormationContextProps>) {
  const trackEvent = usePlausible();
  const [currentFilters, setCurrentFilters] = useStateParams<Filters>({
    defaultValues: {
      presence: "",
      voie: "",
      formationTab: "etablissements",
      cfd: defaultCfd,
      etab: {
        includeAll: true,
        view: "map",
        orderBy: "departement_commune",
      },
    },
  });

  const handleResetFilters = () => {
    trackEvent("domaine-de-formation:filtre", {
      props: { filter_name: "reset" },
    });

    setCurrentFilters((prev) => ({
      ...prev,
      codeRegion: "",
      codeDepartement: "",
      codeAcademie: "",
    }));
  };

  const handleRegionChange = (codeRegion: string) =>{
    trackEvent("domaine-de-formation:filtre", {
      props: { filter_name: "codeRegion" },
    });

    setCurrentFilters((prev) => ({
      ...prev,
      codeRegion,
      codeDepartement: "",
      codeAcademie: "",
      etab: {
        ...prev.etab,
        bbox: undefined,
      },
    }));};

  const handleAcademieChange = (codeAcademie: string) => {
    trackEvent("domaine-de-formation:filtre", {
      props: { filter_name: "codeAcademie" },
    });

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
    trackEvent("domaine-de-formation:filtre", {
      props: { filter_name: "codeDepartement" },
    });

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
    trackEvent("domaine-de-formation:filtre", {
      props: { filter_name: "presence" },
    });

    setCurrentFilters((prev) => ({
      ...prev,
      presence,
    }));
  };

  const handleVoieChange = (voie: Voie) => {
    trackEvent("domaine-de-formation:filtre", {
      props: { filter_name: "voie" },
    });

    setCurrentFilters((prev) => ({
      ...prev,
      voie,
    }));
  };

  const handleTabFormationChange = (formationTab: FormationTab) => {
    trackEvent("domaine-de-formation:filtre", {
      props: { filter_name: "formationTab" },
    });

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
    trackEvent("domaine-de-formation:etablissements:view", {
      props: { view },
    });

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

  const handleCfdChange = (cfd: string) => {
    trackEvent("domaine-de-formation:cfd", {
      props: { cfd },
    });

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

  const context = useMemo(
    () => ({
      currentFilters,
      handleResetFilters,
      handleRegionChange,
      handleAcademieChange,
      handleDepartementChange,
      handlePresenceChange,
      handleVoieChange,
      handleTabFormationChange,
      handleIncludeAllChange,
      handleViewChange,
      handleOrderByChange,
      handleCfdChange,
      handleClearBbox,
      scope: value.scope,
      codeNsf: value.codeNsf,
      libelleNsf: value.libelleNsf,
      regions: value.regions,
      academies: value.academies,
      departements: value.departements,
      handleSetBbox,
    }),
    [
      currentFilters,
      handleResetFilters,
      handleRegionChange,
      handleAcademieChange,
      handleDepartementChange,
      handlePresenceChange,
      handleVoieChange,
      handleTabFormationChange,
      handleIncludeAllChange,
      handleViewChange,
      handleOrderByChange,
      handleCfdChange,
      handleClearBbox,
      handleSetBbox,
      value,
    ]
  );

  return <FormationContext.Provider value={context}>{children}</FormationContext.Provider>;
}

export const useFormationContext = () => useContext(FormationContext);
