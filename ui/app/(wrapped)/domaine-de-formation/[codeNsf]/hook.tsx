import { useCallback, useEffect, useMemo, useState } from "react";
import { OptionSchema } from "shared/schema/optionSchema";

import { useStateParams } from "@/utils/useFilters";

import {
  DomaineDeFormationFilters,
  Filters,
  Formation,
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
  cfd,
}: {
  nsfs: NsfOptions;
  codeNsf: string;
  filters: DomaineDeFormationFilters;
  defaultFormations: Formation[];
  cfd: string;
}) => {
  const [formations, setFormations] = useState<Formation[]>(defaultFormations);
  const [regionOptions] = useState<OptionSchema[]>(filters.regions);
  const [academieOptions, setAcademieOptions] = useState<OptionSchema[]>(
    filters.academies
  );
  const [departementOptions, setDepartementOptions] = useState<OptionSchema[]>(
    filters.departements
  );
  const [currentFilters, setCurrentFilters] = useStateParams<Filters>({
    defaultValues: {
      presence: "",
      voie: "",
      formationTab: "indicateurs",
      cfd,
    },
  });

  const resetFilters = useCallback(
    ({
      codeRegion,
      codeAcademie,
      codeDepartement,
    }: {
      codeRegion?: string;
      codeAcademie?: string;
      codeDepartement?: string;
    }) => {
      setCurrentFilters({
        ...currentFilters,
        codeRegion: codeRegion ?? "",
        codeDepartement: codeDepartement ?? "",
        codeAcademie: codeAcademie ?? "",
      });
    },
    [setCurrentFilters, currentFilters]
  );

  const handleRegionChange = useCallback(
    (codeRegion: string) => {
      setCurrentFilters({
        ...currentFilters,
        codeRegion,
        codeDepartement: "",
        codeAcademie: "",
      });
      setAcademieOptions(
        filters.academies.filter(
          (academie) => codeRegion === "" || academie.codeRegion === codeRegion
        )
      );
      setDepartementOptions(
        filters.departements.filter(
          (departement) =>
            codeRegion === "" || departement.codeRegion === codeRegion
        )
      );
    },
    [setCurrentFilters, currentFilters, filters]
  );

  const handleAcademieChange = useCallback(
    (codeAcademie: string) => {
      const { codeRegion } = filters.academies.find(
        (academie) => academie.value === codeAcademie
      ) ?? { codeRegion: currentFilters.codeRegion };
      setCurrentFilters({
        ...currentFilters,
        codeRegion,
        codeAcademie,
        codeDepartement: "",
      });
      setDepartementOptions(
        filters.departements.filter((departement) =>
          codeAcademie === ""
            ? departement.codeRegion === codeRegion
            : departement.codeAcademie === codeAcademie
        )
      );
    },
    [setCurrentFilters, currentFilters]
  );

  const handleDepartementChange = useCallback(
    (codeDepartement: string) => {
      const { codeRegion, codeAcademie } = filters.departements.find(
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
    (tab: FormationTab) => {
      setCurrentFilters({ formationTab: tab });
    },
    [setCurrentFilters, currentFilters]
  );

  const handleSelectCfd = useCallback(
    (cfd: string) => {
      setCurrentFilters({ ...currentFilters, cfd });
    },
    [setCurrentFilters, currentFilters]
  );

  const currentNsfOption = useMemo(
    () => nsfs.find((nsf) => nsf.value === codeNsf) ?? null,
    [nsfs, codeNsf]
  );

  useEffect(() => {
    setFormations(
      defaultFormations
        .filter((formation) =>
          currentFilters.presence === "dispensees" ? formation.nbEtab > 0 : true
        )
        .filter((formation) =>
          currentFilters.presence === "absentes" ? formation.nbEtab === 0 : true
        )
        .filter((formation) =>
          currentFilters.voie === "apprentissage"
            ? formation.apprentissage && !formation.scolaire
            : true
        )
        .filter((formation) =>
          currentFilters.voie === "scolaire"
            ? formation.scolaire && !formation.apprentissage
            : true
        )
    );
  }, [currentFilters, defaultFormations, setFormations]);

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
    formations,
  };
};
