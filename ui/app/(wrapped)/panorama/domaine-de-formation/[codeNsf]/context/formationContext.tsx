"use client";

import { usePlausible } from "next-plausible";
import { createContext, useContext } from "react";
import type { ScopeZone } from "shared";

import { useDomaineDeFormationSearchParams } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/page.client";
import type {
  Academie,
  Bbox,
  Departement,
  EtablissementsOrderBy,
  EtablissementsView,
  Filters,
  FormationListItem,
  FormationTab,
  Presence,
  Region,
  Voie,
} from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { useStateParams } from "@/utils/useFilters";

import { useDomaineDeFormation } from "./domaineDeFormationContext";

const findDefaultCfd = (
  defaultCfd: string | undefined,
  formations: FormationListItem[],
  formationByCodeNiveauDiplome: Record<string, FormationListItem[]>
): string => {
  if (defaultCfd) {
    const isInList = formations.find((f) => f.cfd === defaultCfd);

    if (isInList) {
      return defaultCfd;
    }
  }
  const firstFormations = formationByCodeNiveauDiplome[Object.keys(formationByCodeNiveauDiplome)[0]];

  const formationWithAtLeastOneEtab = firstFormations?.filter((f) => f.nbEtab > 0);

  return formationWithAtLeastOneEtab?.[0]?.cfd ?? "";
};

type InputFormationContextType = {
  scope?: ScopeZone;
  regions?: Region[];
  academies?: Academie[];
  departements?: Departement[];
  setScope: (scope: ScopeZone) => void,
  setRegions: (regions: Region[]) => void,
  setAcademies: (academies: Academie[]) => void,
  setDepartements: (departements: Departement[]) => void
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
  setDepartements: (departements: Departement[]) => void
};

type FormationContextProps = {
  children: React.ReactNode;
  value: InputFormationContextType;
};

export const FormationContext = createContext<FormationContextType>({} as FormationContextType);

export function FormationContextProvider({ children, value }: Readonly<FormationContextProps>) {
  const trackEvent = usePlausible();
  const { cfd } = useDomaineDeFormationSearchParams();
  const { formations, formationsByLibelleNiveauDiplome } = useDomaineDeFormation();
  const defaultCfd = findDefaultCfd(cfd, formations, formationsByLibelleNiveauDiplome);

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

    const academie = value.academies?.find((a) => a.value === codeAcademie);

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

    const departement = value.departements?.find((d) => d.value === codeDepartement);

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

  const context = {
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
    setCurrentFilters,
    ...value
  };

  return <FormationContext.Provider value={context}>{children}</FormationContext.Provider>;
}

export const useFormationContext = () => useContext(FormationContext);
