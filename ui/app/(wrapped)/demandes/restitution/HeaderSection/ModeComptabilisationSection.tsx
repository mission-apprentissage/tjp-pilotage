import {
  Flex,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";

import type {
  FiltersDemandesRestitution,
} from "@/app/(wrapped)/demandes/restitution/types";
import { TooltipIcon } from "@/components/TooltipIcon";

export const ModeComptabilisationSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
}: {
  activeFilters: FiltersDemandesRestitution;
  handleFilters: (
    type: keyof FiltersDemandesRestitution,
    value: FiltersDemandesRestitution[keyof FiltersDemandesRestitution]
  ) => void;
  filterTracker: (filterName: keyof FiltersDemandesRestitution) => () => void;
}) => {
  return (
    <Flex bgColor={"blueecume.950"} borderRadius={5} px={4} py={2} mb={2}>
      <Flex bgColor={"white"} borderRadius={"8px"} p={1} px={2} h="fit-content">
        <Text fontWeight={700}>MODE DE COMPTABILISATION</Text>
        <TooltipIcon ms={2} my={"auto"} label={
          <Flex direction={"column"} gap={2}>
            <Text>
              Choisissez comment les places transformées sont comptabilisées dans les compteurs.
            </Text>
          </Flex>
        } />
      </Flex>
      <RadioGroup
        as={Flex}
        ms={"auto"}
        defaultValue={activeFilters.modeComptabilisation ?? "capaciteReelle"}
        onChange={(value) => {
          filterTracker("modeComptabilisation");
          handleFilters("modeComptabilisation", value);
        }}
        gap={4}
      >
        <Radio value="capaciteReelle" variant={"blueControl"}>
          <Flex>
            Capacité réelle
            <TooltipIcon ms={2} my={"auto"} label={
              "Comptabilise les créations et fermetures nettes de places par formation et établissement (données alignées avec l'export)."
            } />
          </Flex>
        </Radio>
        <Radio value="tauxTransformation" variant={"blueControl"}>
          <Flex>
            Taux de transformation
            <TooltipIcon ms={2} my={"auto"} label={
              "Comptabilise les places selon le mode de calcul du taux de transformation (données alignées avec la page Pilotage)."
            } />
          </Flex>
        </Radio>
      </RadioGroup>

    </Flex>

  );
};
