import { useCallback } from "react";

import { useStateParams } from "@/utils/useFilters";

import { NsfOptions } from "./types";

export const useDomaineDeFormation = ({
  nsfs,
  codeNsf,
}: {
  nsfs: NsfOptions;
  codeNsf: string;
}) => {
  const [currentFilters, setCurrentFilters] = useStateParams<{
    cfd?: string;
    codeRegion?: string;
    codeDepartement?: string;
    codeAcademie?: string;
  }>({ defaultValues: {} });

  const resetFilters = useCallback(() => {
    setCurrentFilters({});
  }, [setCurrentFilters]);

  const handleRegionChange = useCallback(
    (codeRegion: string) => {
      if (codeRegion === "") {
        resetFilters();
      } else {
        setCurrentFilters({
          codeRegion,
          codeDepartement: "",
          codeAcademie: "",
        });
      }
    },
    [setCurrentFilters]
  );

  const handleAcademieChange = useCallback(
    (codeAcademie: string) => {
      if (codeAcademie === "") {
        resetFilters();
      } else {
        setCurrentFilters({ codeAcademie, codeDepartement: "" });
      }
    },
    [setCurrentFilters]
  );

  const handleDepartementChange = useCallback(
    (codeDepartement: string) => {
      if (codeDepartement === "") {
        resetFilters();
      } else {
        setCurrentFilters({ codeDepartement });
      }
    },
    [setCurrentFilters]
  );

  const currentNsfOption = nsfs.find((nsf) => nsf.value === codeNsf) ?? null;

  return {
    currentFilters,
    resetFilters,
    handleRegionChange,
    handleAcademieChange,
    handleDepartementChange,
    currentNsfOption,
  };
};
