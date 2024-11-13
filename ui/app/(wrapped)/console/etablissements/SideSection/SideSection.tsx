import { Button, Checkbox, Divider, Flex, Text, useDisclosure } from "@chakra-ui/react";

import type { Filters, FiltersList } from "@/app/(wrapped)/console/etablissements/types";
import { DoubleArrowLeft } from "@/components/icons/DoubleArrowLeft";
import { DoubleArrowRight } from "@/components/icons/DoubleArrowRight";
import { Multiselect } from "@/components/Multiselect";

export const SideSection = ({
  handleFilters,
  searchParams,
  filtersList,
}: {
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  searchParams: {
    filters?: Partial<Filters>;
  };
  filtersList?: FiltersList;
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Flex flex={"shrink"} direction={"column"} bgColor={"bluefrance.975"} p={2} gap={5}>
      {isOpen ? (
        <Button
          variant="externalLink"
          leftIcon={<DoubleArrowLeft />}
          onClick={() => onToggle()}
          cursor="pointer"
          px={3}
          mt={5}
        >
          Masquer les filtres
        </Button>
      ) : (
        <Button
          variant="externalLink"
          rightIcon={<DoubleArrowRight />}
          onClick={() => onToggle()}
          cursor="pointer"
          mt={5}
        />
      )}
      {isOpen && (
        <Flex gap={3} direction={"column"}>
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("secteur", selected)}
            options={filtersList?.secteurs}
            value={searchParams.filters?.secteur ?? []}
            menuZIndex={3}
          >
            Secteur
          </Multiselect>
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("uai", selected)}
            options={filtersList?.etablissements}
            value={searchParams.filters?.uai ?? []}
            menuZIndex={3}
          >
            Établissement
          </Multiselect>
          <Divider />
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
            options={filtersList?.diplomes}
            value={searchParams.filters?.codeNiveauDiplome ?? []}
            menuZIndex={3}
          >
            Diplôme
          </Multiselect>
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("codeDispositif", selected)}
            options={filtersList?.dispositifs}
            value={searchParams.filters?.codeDispositif ?? []}
            menuZIndex={3}
          >
            Dispositif
          </Multiselect>
          <Flex>
            <Checkbox
              variant="accessible"
              size="lg"
              onChange={(event) => {
                handleFilters("withAnneeCommune", event.target.checked.toString() ?? "false");
              }}
              isChecked={searchParams.filters?.withAnneeCommune !== "false"}
              whiteSpace={"nowrap"}
              ms={1}
            >
              <Text fontSize={"14px"}>2nde et 1ère communes</Text>
            </Checkbox>
          </Flex>
          <Divider />
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("codeNsf", selected)}
            options={filtersList?.libellesNsf}
            value={searchParams.filters?.codeNsf ?? []}
            menuZIndex={3}
          >
            Domaine de formation (NSF)
          </Multiselect>
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("cfdFamille", selected)}
            options={filtersList?.familles}
            value={searchParams.filters?.cfdFamille ?? []}
            menuZIndex={3}
          >
            Famille
          </Multiselect>
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("cfd", selected)}
            options={filtersList?.formations}
            value={searchParams.filters?.cfd ?? []}
            menuZIndex={3}
          >
            Formation
          </Multiselect>
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("positionQuadrant", selected)}
            options={filtersList?.positionsQuadrant}
            value={searchParams.filters?.positionQuadrant ?? []}
            menuZIndex={10000}
          >
            Position dans le quadrant
          </Multiselect>
        </Flex>
      )}
    </Flex>
  );
};
