"use client";

import { Container, Flex } from "@chakra-ui/react";

import { FiltersSection } from "./components/FiltersSection/FiltersSection";
import { FormationSection } from "./components/FormationSection";
import { HeaderSection } from "./components/HeaderSection/HeaderSection";
import { LiensUtilesSection } from "./components/LiensUtilesSection/LiensUtilesSection";
import { FormationContextProvider } from "./context/formationContext";
import { useDomaineDeFormation } from "./hook";
import type { DomaineDeFormationFilters, FormationListItem, NsfOptions } from "./types";

type Props = {
  codeNsf: string;
  libelleNsf: string;
  filters: DomaineDeFormationFilters;
  nsfs: NsfOptions;
  defaultFormations: FormationListItem[];
  cfd: string;
};

export const PageDomaineDeFormationClient = ({ codeNsf, libelleNsf, filters, nsfs, defaultFormations, cfd }: Props) => {
  const {
    currentFilters,
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
  } = useDomaineDeFormation({
    nsfs,
    codeNsf,
    filters,
    defaultFormations,
    defaultCfd: cfd,
  });

  return (
    <FormationContextProvider>
      <Flex bgColor={"bluefrance.975"}>
        <Container mt={"44px"} maxW={"container.xl"}>
          <HeaderSection codeNsf={codeNsf} libelleNsf={libelleNsf} codeRegion={currentFilters.codeRegion} />
        </Container>
      </Flex>
      <Flex bgColor={"bluefrance.975"} position="sticky" top={"52px"} left={0} zIndex="sticky">
        <Container maxW={"container.xl"}>
          <FiltersSection
            filters={currentFilters}
            onRegionChange={handleRegionChange}
            regionOptions={regionOptions}
            onAcademieChange={handleAcademieChange}
            academieOptions={academieOptions}
            onDepartementChange={handleDepartementChange}
            departementOptions={departementOptions}
            resetFilters={resetFilters}
          />
        </Container>
      </Flex>
      <FormationSection
        filters={currentFilters}
        onChangePresence={handlePresenceChange}
        onChangeVoie={handleVoieChange}
        changeTab={handleTabFormationChange}
        formations={formations}
        selectCfd={handleSelectCfd}
        scope={scope}
        filtersNumberOfFormations={filtersNumberOfFormations}
        codeNsf={codeNsf}
      />
      <LiensUtilesSection filters={currentFilters} scope={scope} />
    </FormationContextProvider>
  );
};
