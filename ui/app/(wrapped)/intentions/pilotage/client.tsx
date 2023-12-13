"use client";

import { Box, Container, SimpleGrid } from "@chakra-ui/react";

import { CartoSection } from "./components/CartoSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { VueTauxTransformationSection } from "./components/VueTauxTransformationSection";
import { usePilotageIntentionsHook } from "./hook";

export const PilotageIntentionsClient = () => {
  const {
    filters,
    isLoading,
    data,
    scope,
    setScope,
    resetScope,
    indicateur,
    indicateurOptions,
    order,
    filterTracker,
    handleFilters,
    handleIndicateurChange,
    handleOrder,
  } = usePilotageIntentionsHook();

  return (
    <Container maxWidth={"100%"} bg="blueecume.950">
      <Container maxWidth={"container.xl"} py="4">
        <FiltersSection
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading}
          data={data}
          scope={scope}
          setScope={setScope}
        />
        <Box>
          <SimpleGrid spacing={8} columns={[2]} mt={8}>
            <Box>
              <IndicateursClesSection
                data={data}
                isLoading={isLoading}
                scope={scope}
              />
            </Box>
            <CartoSection
              filters={filters}
              order={order}
              indicateur={indicateur}
              handleIndicateurChange={handleIndicateurChange}
              indicateurOptions={indicateurOptions}
              scope={scope}
              setScope={setScope}
              resetScope={resetScope}
              key={`${scope.type}-${scope.value}`}
            />
          </SimpleGrid>
          {/* <Box mt={14}>
            <QuadrantSection
              scope={scope}
              parentFilters={filters}
              scopeFilters={data?.filters}
            />
          </Box> */}
          <SimpleGrid spacing={5} columns={[2]} mt={14}>
            <VueTauxTransformationSection
              filters={filters}
              order={order}
              handleOrder={handleOrder}
              scope={scope}
            />
            {/* <VueOuverturesFermeturesSection
              data={data}
              isLoading={isLoading}
              codeRegion={territoiresFilters.regions}
              order={order}
              handleOrder={handleOrder}
            /> */}
          </SimpleGrid>
        </Box>
      </Container>
    </Container>
  );
};
