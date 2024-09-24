"use client";

import {
  Box,
  Collapse,
  Container,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { feature } from "../../../../utils/feature";
import { CartoSection } from "./components/CartoSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { QuadrantSection } from "./components/QuadrantSection";
import { VueOuverturesFermeturesSection } from "./components/VueOuverturesFermeturesSection";
import { VueTauxTransformationSection } from "./components/VueTauxTransformationSection";
import { usePilotageIntentionsHook } from "./hook";

const BandeauTauxTransfo = () => {
  const { isOpen, onClose } = useDisclosure({
    defaultIsOpen: feature.bandeauTauxTransfo,
  });

  return (
    <Collapse in={isOpen}>
      <Flex flex={1} justify={"center"}>
        <Flex
          maxWidth={"container.xl"}
          direction={"row"}
          gap={4}
          mt={4}
          color={"info.text"}
          border={"1px solid"}
          borderColor={"info.text"}
        >
          <Flex bgColor={"info.text"} color={"white"} p={3}>
            <Icon
              icon="ri:file-info-fill"
              fontSize="20px"
              style={{ marginBottom: "auto" }}
            />
          </Flex>
          <Text fontSize={16} p={2} px={1}>
            Le taux de transformation affiché actuellement ne tient pas compte
            de certaines données (colorations, places fermées en
            apprentissage...) ; il sera rectifié lors de la mise en ligne de la
            nouvelle page début octobre. Nous vous remercions de votre
            compréhension.
          </Text>
          <Flex p={2} px={1}>
            <Icon
              onClick={onClose}
              cursor="pointer"
              icon="ri:close-fill"
              width="24px"
              height="24px"
            />
          </Flex>
        </Flex>
      </Flex>
    </Collapse>
  );
};

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
      <BandeauTauxTransfo />
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
