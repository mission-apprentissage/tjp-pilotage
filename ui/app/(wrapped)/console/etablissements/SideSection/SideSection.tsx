import {Button, Checkbox, Divider, Flex, Select, Text, useDisclosure, VisuallyHidden} from '@chakra-ui/react';
import { CURRENT_RENTREE } from 'shared';

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
          <VisuallyHidden as="label" htmlFor="console-filters-rentree-scolaire">Filtrer par rentrée scolaire</VisuallyHidden>
          <Select
            id="console-filters-rentree-scolaire"
            placeholder="Rentrée scolaire"
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(e) => {
              if(e.target.value) {
                handleFilters("rentreeScolaire", [e.target.value]);
                return;
              }
              handleFilters("rentreeScolaire", [CURRENT_RENTREE]); // Reset to current rentrée if no value is selected
            }}
            value={searchParams.filters?.rentreeScolaire?.[0] ?? CURRENT_RENTREE}
          >
            {filtersList?.rentreesScolaires.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <Divider />
          <Multiselect
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("secteur", selected)}
            options={filtersList?.secteurs}
            value={searchParams.filters?.secteur ?? []}
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
              <Text fontSize={14}>2nde et 1ère communes</Text>
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
          >
            Position dans le quadrant
          </Multiselect>
        </Flex>
      )}
    </Flex>
  );
};
