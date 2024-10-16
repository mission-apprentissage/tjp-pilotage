import { useCallback, useEffect, useMemo, useState } from "react";
import type { ScopeZone } from "shared";
import { ScopeEnum } from "shared";
import type { OptionSchema } from "shared/schema/optionSchema";

import { useStateParams } from "@/utils/useFilters";

import type {
  DomaineDeFormationFilters,
  Filters,
  FiltersNumberOfFormations,
  FormationListItem,
  FormationTab,
  NsfOptions,
  Presence,
  Voie,
} from "./types";

export const useDomaineDeFormation = ({
  nsfs,
  codeNsf,
  filters,
  defaultFormations,
  defaultCfd,
}: {
  nsfs: NsfOptions;
  codeNsf: string;
  filters: DomaineDeFormationFilters;
  defaultFormations: FormationListItem[];
  defaultCfd: string;
}) => {
  const [scope, setScope] = useState<ScopeZone>(ScopeEnum.national);
  const [formations, setFormations] = useState<FormationListItem[]>(defaultFormations);
  const [regionOptions] = useState<OptionSchema[]>(filters.regions);
  const [academieOptions, setAcademieOptions] = useState<OptionSchema[]>(filters.academies);
  const [departementOptions, setDepartementOptions] = useState<OptionSchema[]>(filters.departements);
  const [currentFilters, setCurrentFilters] = useStateParams<Filters>({
    defaultValues: {
      presence: "",
      voie: "",
      formationTab: "indicateurs",
      cfd: defaultCfd,
    },
  });

  const [filtersNumberOfFormations, setFiltersNumberOfFormations] = useState<FiltersNumberOfFormations>({
    formationsAllScopes: 0,
    formationsInScope: 0,
    formationsOutsideScope: 0,
    formationsScolaire: 0,
    formationsApprentissage: 0,
    formationsAllVoies: 0,
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
      setAcademieOptions(
        // @ts-expect-error TODO
        filters.academies.filter((academie) => codeRegion === "" || academie.codeRegion === codeRegion)
      );
      setDepartementOptions(
        // @ts-expect-error TODO
        filters.departements.filter((departement) => codeRegion === "" || departement.codeRegion === codeRegion)
      );
    },
    [setCurrentFilters, currentFilters, filters]
  );

  const handleAcademieChange = useCallback(
    (codeAcademie: string) => {
      // @ts-expect-error TODO
      const { codeRegion } = filters.academies.find((academie) => academie.value === codeAcademie) ?? {
        codeRegion: currentFilters.codeRegion,
      };
      setCurrentFilters({
        ...currentFilters,
        codeRegion,
        codeAcademie,
        codeDepartement: "",
      });
      setDepartementOptions(
        // @ts-expect-error TODO
        filters.departements.filter((departement) =>
          codeAcademie === "" ? departement.codeRegion === codeRegion : departement.codeAcademie === codeAcademie
        )
      );
    },
    [setCurrentFilters, currentFilters, filters]
  );

  const handleDepartementChange = useCallback(
    (codeDepartement: string) => {
      const { codeRegion, codeAcademie } = filters.departements.find(
        // @ts-expect-error TODO
        (departement) => departement.value === codeDepartement
      ) ?? {
        codeRegion: currentFilters.codeRegion,
        codeAcademie: currentFilters.codeAcademie,
      };
      setCurrentFilters({
        ...currentFilters,
        codeRegion,
        codeAcademie,
        codeDepartement,
      });
    },
    [setCurrentFilters, currentFilters, filters.departements]
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

  // @ts-expect-error TODO
  const currentNsfOption = useMemo(() => nsfs.find((nsf) => nsf.value === codeNsf) ?? null, [nsfs, codeNsf]);

  useEffect(() => {
    setFormations(
      defaultFormations
        .filter((formation) => (currentFilters.presence === "dispensees" ? formation.nbEtab > 0 : true))
        .filter((formation) => (currentFilters.presence === "absentes" ? formation.nbEtab === 0 : true))
        .filter((formation) => (currentFilters.voie === "apprentissage" ? formation.apprentissage : true))
        .filter((formation) => (currentFilters.voie === "scolaire" ? formation.scolaire : true))
    );
  }, [currentFilters, defaultFormations, setFormations]);

  useEffect(() => {
    if (currentFilters.codeDepartement) {
      setScope(ScopeEnum.département);
    } else if (currentFilters.codeAcademie) {
      setScope(ScopeEnum.académie);
    } else if (currentFilters.codeRegion) {
      setScope(ScopeEnum.région);
    } else {
      setScope(ScopeEnum.national);
    }
  }, [currentFilters]);

  useEffect(() => {
    const formationsByPresence = defaultFormations
      .filter((formation) => (currentFilters.presence === "dispensees" ? formation.nbEtab > 0 : true))
      .filter((formation) => (currentFilters.presence === "absentes" ? formation.nbEtab === 0 : true));

    const formationsByVoie = defaultFormations
      .filter((formation) => (currentFilters.voie === "apprentissage" ? formation.apprentissage : true))
      .filter((formation) => (currentFilters.voie === "scolaire" ? formation.scolaire : true));

    setFiltersNumberOfFormations({
      formationsAllScopes: formationsByVoie.length,
      formationsInScope: formationsByVoie.filter((f) => f.nbEtab > 0).length,
      formationsOutsideScope: formationsByVoie.filter((f) => f.nbEtab === 0).length,
      formationsAllVoies: formationsByPresence.length,
      formationsScolaire: formationsByPresence.filter((f) => f.scolaire).length,
      formationsApprentissage: formationsByPresence.filter((f) => f.apprentissage).length,
    });
  }, [defaultFormations, currentFilters.presence, currentFilters.voie]);

  useEffect(() => {
    // Les filtres vont modifier la liste des formations affichées
    // Si la formation selectionnée n'existe plus, on met par défault celle avec le plus d'établissements
    if (!formations.find((f) => f.cfd === currentFilters.cfd)) {
      setCurrentFilters({
        ...currentFilters,
        cfd: formations.sort((a, z) => z.nbEtab - a.nbEtab)[0]?.cfd ?? "",
      });
    }
  }, [currentFilters, formations, setCurrentFilters]);

  return {
    currentFilters,
    currentNsfOption,
    resetFilters,
    handleRegionChange,
    handleAcademieChange,
    handleDepartementChange,
    handlePresenceChange,
    handleVoieChange,
    handleTabFormationChange,
    handleSelectCfd,
    regionOptions,
    academieOptions,
    departementOptions,
    scope,
    formations,
    filtersNumberOfFormations,
  };
};
