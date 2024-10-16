import { Button, Container, Flex, Select } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import type { OptionSchema } from "shared/schema/optionSchema";

import { useFormationContext } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/context/formationContext";

export const FiltersSection = ({
  regionOptions,
  academieOptions,
  departementOptions,
}: {
  regionOptions: OptionSchema[];
  academieOptions: OptionSchema[];
  departementOptions: OptionSchema[];
}) => {
  const { currentFilters, handleRegionChange, handleAcademieChange, handleDepartementChange, resetFilters } =
    useFormationContext();

  return (
    <Flex bgColor={"bluefrance.975"} position="sticky" top={"52px"} left={0} zIndex="docked">
      <Container maxW={"container.xl"}>
        <Flex justify="space-between" gap={"1rem"} my={"24px"} align="center">
          <Flex gap={"1rem"} w={"60%"}>
            {/* REGION */}
            <Select
              placeholder="Région: Toutes"
              onChange={(e) => handleRegionChange(e.target.value)}
              bgColor={"white"}
              value={currentFilters.codeRegion}
              autoFocus={true}
              borderWidth={"1px"}
              borderStyle={"solid"}
              borderColor={"grey.900"}
              aria-label="Sélectionner une région"
            >
              {regionOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            {/* ACADEMIE */}
            <Select
              placeholder="Académie: Toutes"
              onChange={(e) => handleAcademieChange(e.target.value)}
              bgColor={"white"}
              value={currentFilters.codeAcademie}
              autoFocus={true}
              borderWidth={"1px"}
              borderStyle={"solid"}
              borderColor={"grey.900"}
              aria-label="Sélectionner une académie"
            >
              {academieOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            {/* DEPARTEMENT */}
            <Select
              placeholder="Département: Tous"
              onChange={(e) => handleDepartementChange(e.target.value)}
              bgColor={"white"}
              value={currentFilters.codeDepartement}
              autoFocus={true}
              borderWidth={"1px"}
              borderStyle={"solid"}
              borderColor={"grey.900"}
              aria-label="Sélectionner un département"
            >
              {departementOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Flex>
          <Button
            variant="externalLink"
            border={"none"}
            leftIcon={<Icon icon={"ri:refresh-line"} />}
            mt={"auto"}
            onClick={resetFilters}
          >
            Réinitialiser
          </Button>
          <Button
            variant="primary"
            leftIcon={<Icon icon="ri:search-line" height={"16px"} />}
            as={NextLink}
            href="/panorama/domaine-de-formation"
          >
            Rechercher un autre domaine
          </Button>
        </Flex>
      </Container>
    </Flex>
  );
};
