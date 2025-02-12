import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Select,
  Tag,
  Text,
  VisuallyHidden,
  Wrap,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import { DeleteRequeteEnregistreeButton } from "@/app/(wrapped)/console/components/DeleteRequeteEnregistreeButton";
import { FilterTags } from "@/app/(wrapped)/console/components/FilterTags";
import type { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type {
  Filters,
  FiltersList,
  Order,
  RequetesEnregistrees,
  RequetesSuggerees,
} from "@/app/(wrapped)/console/formations/types";
import { Multiselect } from "@/components/Multiselect";
import { feature } from "@/utils/feature";

const REQUETES_SUGGEREES: RequetesSuggerees = [
  {
    filtres: {
      formationSpecifique: [TypeFormationSpecifiqueEnum["Transition écologique"]],
    },
    nom: TypeFormationSpecifiqueEnum["Transition écologique"],
    couleur: "success.950",
    active: feature.formationsSpecifiqueConsole,
    conditions: [],
  },
  {
    filtres: {
      formationSpecifique: [TypeFormationSpecifiqueEnum["Transition démographique"]],
    },
    nom: TypeFormationSpecifiqueEnum["Transition démographique"],
    couleur: "grey.1000_active",
    active: feature.formationsSpecifiqueConsole,
    conditions: [],
  },
  {
    filtres: {
      formationSpecifique: [TypeFormationSpecifiqueEnum["Transition numérique"]],
    },
    nom: TypeFormationSpecifiqueEnum["Transition numérique"],
    couleur: "bluefrance.925",
    active: feature.formationsSpecifiqueConsole,
    conditions: [],
  },
  {
    filtres: {
      formationSpecifique: [TypeFormationSpecifiqueEnum["Action prioritaire"]],
    },
    nom: TypeFormationSpecifiqueEnum["Action prioritaire"],
    couleur: "yellowTournesol.950",
    active: true,
    conditions: ["codeRegion"],
  },
];

export const FiltersSection = ({
  handleFilters,
  setSearchParams,
  searchParams,
  filtersList,
  requetesEnregistrees,
  requeteEnregistreeActuelle,
  setRequeteEnregistreeActuelle,
}: {
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: string;
  };
  filtersList?: FiltersList;
  requetesEnregistrees?: RequetesEnregistrees;
  requeteEnregistreeActuelle: { nom: string; couleur?: string };
  setRequeteEnregistreeActuelle: (requeteEnregistreeActuelle: { nom: string; couleur?: string }) => void;
}) => {
  const resetFilters = () => {
    setSearchParams({
      filters: {
        ...searchParams.filters,
        codeRegion: [],
        codeAcademie: [],
        codeDepartement: [],
        commune: [],
        codeNiveauDiplome: [],
        codeDispositif: [],
        cfdFamille: [],
        cfd: [],
        codeNsf: [],
        positionQuadrant: [],
        formationSpecifique: [],
      },
      search: "",
    });
    setRequeteEnregistreeActuelle({ nom: "Requêtes favorites" });
  };

  const [deleteButtonToDisplay, setDeleteButtonToDisplay] = useState<string>("");

  const filteredRequetesSuggerees = REQUETES_SUGGEREES.filter((r) => r.active).filter((r) =>
    r.conditions?.every((condition) => searchParams.filters?.[condition as keyof Partial<Filters>])
  );

  const isDisabled = !filteredRequetesSuggerees.length && !requetesEnregistrees?.length;

  return (
    <Flex direction={"column"} gap={4} wrap={"wrap"}>
      <Wrap spacing={3}>
        <Menu autoSelect={false} gutter={3}>
          <MenuButton
            as={Button}
            variant={"selectButton"}
            rightIcon={<ChevronDownIcon />}
            width={"15rem"}
            size="md"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="grey.900"
            bg={"white"}
            isDisabled={isDisabled}
          >
            <Flex direction="row" gap={2} overflow={"hidden"} whiteSpace="nowrap">
              {requeteEnregistreeActuelle.couleur && (
                <Tag size={"sm"} bgColor={requeteEnregistreeActuelle.couleur} borderRadius={"100%"} />
              )}
              <Text my={"auto"}>{requeteEnregistreeActuelle.nom}</Text>
            </Flex>
          </MenuButton>
          <Portal>
            <MenuList py={0} borderColor="grey.900" borderTopRadius={0} minW={"fit-content"} zIndex={3}>
              {requetesEnregistrees && requetesEnregistrees.length > 0 && (
                <>
                  <MenuGroup title="Vos requêtes favorites" color="grey.425">
                    {requetesEnregistrees?.map((requete) => (
                      <MenuItem
                        p={2}
                        key={requete.id}
                        onClick={() => {
                          setSearchParams({
                            page: 0,
                            filters: requete.filtres,
                          });
                          setRequeteEnregistreeActuelle(requete);
                        }}
                        onMouseEnter={() => setDeleteButtonToDisplay(requete.id)}
                        onMouseLeave={() => setDeleteButtonToDisplay("")}
                        gap={2}
                      >
                        <Tag size={"sm"} bgColor={requete.couleur} borderRadius={"100%"} />
                        <Flex direction="row" whiteSpace={"nowrap"}>
                          {requete.nom}
                        </Flex>
                        {deleteButtonToDisplay === requete.id && (
                          <DeleteRequeteEnregistreeButton requeteEnregistree={requete} />
                        )}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                  <MenuDivider />
                </>
              )}
              {feature.requetesSuggerees && (
                <MenuGroup title="Requêtes suggérées" color="grey.425">
                  {filteredRequetesSuggerees.map((requeteSuggeree) => (
                    <MenuItem
                      p={2}
                      key={requeteSuggeree.nom}
                      onClick={() => {
                        setSearchParams({
                          page: 0,
                          filters: { ...searchParams.filters, ...requeteSuggeree.filtres },
                        });
                        setRequeteEnregistreeActuelle(requeteSuggeree);
                      }}
                      gap={2}
                    >
                      <Tag size={"sm"} bgColor={requeteSuggeree.couleur} borderRadius={"100%"} />
                      <Flex direction="row">{requeteSuggeree.nom}</Flex>
                    </MenuItem>
                  ))}
                </MenuGroup>
              )}
              {
                (
                  (!feature.requetesSuggerees || filteredRequetesSuggerees.length === 0)
                  && (!requetesEnregistrees || requetesEnregistrees.length === 0)
                ) && (
                  <VisuallyHidden as={MenuItem} />
                )
              }
            </MenuList>
          </Portal>
        </Menu>
        <VisuallyHidden as="label" htmlFor="console-filters-region">Filtrer par région</VisuallyHidden>
        <Select
          id="console-filters-region"
          placeholder="Toutes les régions"
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(e) => {
            handleFilters("codeRegion", [e.target.value]);
          }}
          value={searchParams.filters?.codeRegion?.[0] ?? ""}
        >
          {filtersList?.regions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Multiselect
          display={["none", null, "flex"]}
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(selected) => handleFilters("codeAcademie", selected)}
          options={filtersList?.academies}
          value={searchParams.filters?.codeAcademie ?? []}
        >
          Académie
        </Multiselect>
        <Multiselect
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(selected) => handleFilters("codeDepartement", selected)}
          options={filtersList?.departements}
          value={searchParams.filters?.codeDepartement ?? []}
        >
          Département
        </Multiselect>
        <Multiselect
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(selected) => handleFilters("commune", selected)}
          options={filtersList?.communes}
          value={searchParams.filters?.commune ?? []}
        >
          Commune
        </Multiselect>
        <Button
          variant="externalLink"
          border={"none"}
          leftIcon={<Icon icon={"ri:refresh-line"} />}
          mt={"auto"}
          onClick={() => resetFilters()}
        >
          Réinitialiser les filtres
        </Button>
      </Wrap>
      <FilterTags
        handleFilters={handleFilters}
        filters={searchParams?.filters}
        filtersList={filtersList}
        isEditable={true}
      />
    </Flex>
  );
};
