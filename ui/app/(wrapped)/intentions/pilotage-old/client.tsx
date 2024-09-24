"use client";

import { Box, Container, Flex } from "@chakra-ui/react";

import { CartoSection } from "./components/CartoSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { QuadrantSection } from "./components/QuadrantSection";
import { VueOuverturesFermeturesSection } from "./components/VueOuverturesFermeturesSection";
import { VueTauxTransformationSection } from "./components/VueTauxTransformationSection";
import { usePilotageIntentionsHook } from "./hook";

export const PilotageIntentionsClient = () => {
  const {
    filters,
    isLoading,
    scopedStats,
    scope,
    indicateur,
    indicateurOptions,
    order,
    filterTracker,
    handleFilters,
    handleIndicateurChange,
    handleOrder,
    findDefaultRentreeScolaireForCampagne,
  } = usePilotageIntentionsHook();

  return (
    <Box bg="blueecume.950">
      <Container maxWidth={"container.xl"} py="4">
        <FiltersSection
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading}
          data={scopedStats}
          scope={scope}
          findDefaultRentreeScolaireForCampagne={
            findDefaultRentreeScolaireForCampagne
          }
        />
        <Box>
          <Flex gap={8} mt={10} flexDirection={["column", null, "row"]}>
            <Box flex={1}>
              <IndicateursClesSection
                data={scopedStats}
                isLoading={isLoading}
                scope={scope}
                filters={filters}
                order={order}
              />
            </Box>
            <CartoSection
              filters={filters}
              order={order}
              indicateur={indicateur}
              handleIndicateurChange={handleIndicateurChange}
              indicateurOptions={indicateurOptions}
              scope={scope}
              handleFilters={handleFilters}
            />
          </Flex>
          <Box mt={14} display={["none", null, "block"]}>
            <QuadrantSection
              scope={scope}
              parentFilters={filters}
              scopeFilters={scopedStats?.filters}
            />
          </Box>
          <Flex gap={5} flexDirection={["column", null, "row"]} mt={14} mb={20}>
            <VueTauxTransformationSection
              data={scopedStats}
              scope={scope}
              order={order}
              isLoading={isLoading}
              handleOrder={handleOrder}
            />
            <VueOuverturesFermeturesSection
              data={scopedStats}
              scope={scope}
              order={order}
              isLoading={isLoading}
              handleOrder={handleOrder}
            />
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};
