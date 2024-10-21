"use client";

import { Container, Flex } from "@chakra-ui/react";

import { FiltersSection } from "./components/FiltersSection/FiltersSection";
import { HeaderSection } from "./components/HeaderSection/HeaderSection";
import { LiensUtilesSection } from "./components/LiensUtilesSection/LiensUtilesSection";
import { FormationContextProvider } from "./context/formationContext";
import { useDomaineDeFormation } from "./hook";
import { DomaineDeFormationFilters, NsfOptions } from "./types";

type Props = {
  codeNsf: string;
  libelleNsf: string;
  filters: DomaineDeFormationFilters;
  nsfs: NsfOptions;
};

export const PageDomaineDeFormationClient = ({
  codeNsf,
  libelleNsf,
  filters,
  nsfs,
}: Props) => {
  const {
    currentFilters,
    resetFilters,
    handleRegionChange,
    handleAcademieChange,
    handleDepartementChange,
    currentNsfOption,
  } = useDomaineDeFormation({
    nsfs,
    codeNsf,
  });

  return (
    <FormationContextProvider>
      <Flex bgColor={"bluefrance.975"}>
        <Container mt={"44px"} maxW={"container.xl"}>
          <HeaderSection codeNsf={codeNsf} libelleNsf={libelleNsf} />
          <FiltersSection
            onRegionChange={handleRegionChange}
            codeRegion={currentFilters.codeRegion ?? ""}
            regionOptions={filters.regions}
            onAcademieChange={handleAcademieChange}
            codeAcademie={currentFilters.codeAcademie ?? ""}
            academieOptions={filters.academies}
            onDepartementChange={handleDepartementChange}
            codeDepartement={currentFilters.codeDepartement ?? ""}
            departementOptions={filters.departements}
            resetFilters={resetFilters}
            nsfs={nsfs}
            currentNsfOption={currentNsfOption}
          />
        </Container>
      </Flex>
      <LiensUtilesSection />
    </FormationContextProvider>
  );
};
