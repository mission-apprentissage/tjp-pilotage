import { Container, Flex, Select, VisuallyHidden } from "@chakra-ui/react";
import type { OptionType } from "shared/schema/optionSchema";

import type { FiltersPanoramaFormation } from "@/app/(wrapped)/panorama/types";
import { getStickyNavHeight } from "@/app/(wrapped)/utils/getStickyNavOffset";
import { Multiselect } from "@/components/Multiselect";

export const FiltersSection = ({
  handleFilters,
  activeFilters,
  libelleNsfOptions,
  code,
  onCodeChanged,
  options,
  diplomeOptions,
}: {
  code?: string;
  onCodeChanged: (code: string) => void;
  options?: OptionType[];
  diplomeOptions?: OptionType[];
  handleFilters: (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => void;
  activeFilters: Partial<FiltersPanoramaFormation>;
  libelleNsfOptions?: OptionType[];
}) => {
  return (
    <Container
      py="4"
      maxW="container.xl"
      position="sticky"
      bg="white"
      top={getStickyNavHeight()}
      borderBottom="1px solid"
      borderColor="grey.900"
      zIndex="2"
      px={0}
    >
      <Flex justify="flex-start" gap={"1rem"}>
        {/* TERRITOIRE */}
        <VisuallyHidden as="label" htmlFor="select-territoire">
          Sélectionner un territoire
        </VisuallyHidden>
        <Select
          id="select-territoire"
          onChange={(e) => onCodeChanged(e.target.value)}
          bgColor={"white"}
          value={code}
          autoFocus={true}
          w={"25%"}
          borderWidth={"2px"}
          borderColor={"bluefrance.113"}
          borderStyle={"solid"}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {/* DIPLOME */}
        <VisuallyHidden as="label" htmlFor="select-diplome">
          Sélectionner un diplôme
        </VisuallyHidden>
        <Select
          id="select-diplome"
          borderWidth={"2px"}
          borderColor={"bluefrance.113"}
          borderStyle={"solid"}
          w={"25%"}
          bgColor={"white"}
          onChange={(e) => {
            if (e.target.value) {
              handleFilters("codeNiveauDiplome", [e.target.value]);
            }
          }}
          value={activeFilters.codeNiveauDiplome?.[0] ?? ""}
          size="md"
        >
          {diplomeOptions?.map((diplome) => (
            <option key={diplome.value} value={diplome.value}>
              {diplome.label}
            </option>
          ))}
        </Select>
        <Multiselect
          onChange={(selected) => handleFilters("codeNsf", selected)}
          width={"25%"}
          size="md"
          options={libelleNsfOptions}
          value={activeFilters.codeNsf ?? []}
          variant={"newInput"}
        >
          Domaine de formation (NSF)
        </Multiselect>
      </Flex>
    </Container>
  );
};
