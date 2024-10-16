"use client";

import { createContext, useCallback, useContext } from "react";
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
  cfd: string;
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
  handleSelectCfd: (cfd: string) => void;
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
};

export const FormationContext = createContext<FormationContextType>({} as FormationContextType);

export function FormationContextProvider({ children, value }: FormationContextProps) {
  const [currentFilters, setCurrentFilters] = useStateParams<Filters>({
    defaultValues: {
      presence: "",
      voie: "",
      formationTab: "indicateurs",
      cfd: value.cfd,
      etab: {
        includeAll: true,
        view: "map",
        orderBy: "departement_commune",
      },
    },
  });

  const resetFilters = useCallback(() => {
    setCurrentFilters({
      ...currentFilters,
      codeRegion: "",
      codeDepartement: "",
      codeAcademie: "",
    });
  }, [setCurrentFilters, currentFilters]);

  const handleRegionChange = useCallback(
    (codeRegion: string) => {
      setCurrentFilters({
        ...currentFilters,
        codeRegion,
        codeDepartement: "",
        codeAcademie: "",
      });
    },
    [setCurrentFilters, currentFilters]
  );

  const handleAcademieChange = useCallback(
    (codeAcademie: string) => {
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
    },
    [setCurrentFilters, currentFilters]
  );

  const handleDepartementChange = useCallback(
    (codeDepartement: string) => {
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
    },
    [setCurrentFilters, currentFilters]
  );

  const handlePresenceChange = useCallback(
    (presence: Presence) => {
      setCurrentFilters({ ...currentFilters, presence });
    },
    [setCurrentFilters, currentFilters]
  );

  const handleVoieChange = useCallback(
    (voie: Voie) => {
      setCurrentFilters({ ...currentFilters, voie });
    },
    [setCurrentFilters, currentFilters]
  );

  const handleTabFormationChange = useCallback(
    (formationTab: FormationTab) => {
      setCurrentFilters({ ...currentFilters, formationTab });
    },
    [setCurrentFilters, currentFilters]
  );

  const handleSelectCfd = useCallback(
    (cfd: string) => {
      setCurrentFilters({ ...currentFilters, cfd });
    },
    [setCurrentFilters, currentFilters]
  );

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
    handleSelectCfd,
    handleIncludeAllChange,
    handleViewChange,
    handleOrderByChange,
    handleChangeCfd,
    handleClearBbox,
    scope: value.scope,
    codeNsf: value.codeNsf,
    cfd: value.cfd,
    regions: value.regions,
    academies: value.academies,
    departements: value.departements,
    handleSetBbox,
  };

  return <FormationContext.Provider value={context}>{children}</FormationContext.Provider>;
}

export const useFormationContext = () => useContext(FormationContext);
