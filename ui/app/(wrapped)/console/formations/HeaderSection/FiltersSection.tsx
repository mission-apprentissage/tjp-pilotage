import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Select,
  Tag,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import { FilterTags } from "@/app/(wrapped)/console/components/FilterTags";
import { RequetesEnregistrees } from "@/app/(wrapped)/console/formations/types";
import { Multiselect } from "@/components/Multiselect";

import { feature } from "../../../../../utils/feature";
import { DeleteRequeteEnregistreeButton } from "../../components/DeleteRequeteEnregistreeButton";
import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, FiltersList, Order } from "../types";

const REQUETES_ENREGISTREES = [
  {
    filtres: {},
    nom: "Transition écologique",
    couleur: "green.submitted",
  },
  {
    filtres: {
      positionQuadrant: [PositionQuadrantEnum["Q4"]],
    },
    nom: "Action prioritaire",
    couleur: "redmarianne.625_hover",
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
  setRequeteEnregistreeActuelle: (requeteEnregistreeActuelle: {
    nom: string;
    couleur?: string;
  }) => void;
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
      },
      search: "",
    });
    setRequeteEnregistreeActuelle({ nom: "Requêtes favorites" });
  };

  const [deleteButtonToDisplay, setDeleteButtonToDisplay] =
    useState<string>("");

  return (
    <Flex direction={"column"} gap={4} wrap={"wrap"}>
      <Wrap spacing={3}>
        <Menu matchWidth={true} autoSelect={false}>
          <MenuButton
            as={Button}
            variant={"selectButton"}
            rightIcon={<ChevronDownIcon />}
            width={[null, null, "64"]}
            size="md"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="grey.900"
            bg={"white"}
          >
            <Flex direction="row" gap={2}>
              {requeteEnregistreeActuelle.couleur && (
                <Tag
                  size={"sm"}
                  bgColor={requeteEnregistreeActuelle.couleur}
                  borderRadius={"100%"}
                />
              )}
              <Text my={"auto"}>{requeteEnregistreeActuelle.nom}</Text>
            </Flex>
          </MenuButton>
          <Portal>
            <MenuList
              py={0}
              borderTopRadius={0}
              minW={"fit-content"}
              zIndex={3}
            >
              {requetesEnregistrees && requetesEnregistrees.length > 0 && (
                <>
                  <Text p={2} color="grey.425">
                    Vos requêtes favorites
                  </Text>
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
                      <Tag
                        size={"sm"}
                        bgColor={requete.couleur}
                        borderRadius={"100%"}
                      />
                      <Flex direction="row">{requete.nom}</Flex>
                      {deleteButtonToDisplay === requete.id && (
                        <DeleteRequeteEnregistreeButton
                          requeteEnregistree={requete}
                        />
                      )}
                    </MenuItem>
                  ))}
                  <Divider />
                </>
              )}
              {feature.requetesSuggerees && (
                <>
                  <Text p={2} color="grey.425">
                    Requêtes suggérées
                  </Text>
                  {REQUETES_ENREGISTREES.map((requeteEnregistree) => (
                    <MenuItem
                      p={2}
                      key={requeteEnregistree.nom}
                      onClick={() => {
                        setSearchParams({
                          page: 0,
                          filters: requeteEnregistree.filtres,
                        });
                        setRequeteEnregistreeActuelle(requeteEnregistree);
                      }}
                      gap={2}
                    >
                      <Tag
                        size={"sm"}
                        bgColor={requeteEnregistree.couleur}
                        borderRadius={"100%"}
                      />
                      <Flex direction="row">{requeteEnregistree.nom}</Flex>
                    </MenuItem>
                  ))}
                </>
              )}
            </MenuList>
          </Portal>
        </Menu>
        <Select
          placeholder="Toutes les régions"
          size="md"
          variant="newInput"
          width="15rem"
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
          width="15rem"
          onChange={(selected) => handleFilters("codeAcademie", selected)}
          options={filtersList?.academies}
          value={searchParams.filters?.codeAcademie ?? []}
          menuZIndex={3}
        >
          Académie
        </Multiselect>
        <Multiselect
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="15rem"
          onChange={(selected) => handleFilters("codeDepartement", selected)}
          options={filtersList?.departements}
          value={searchParams.filters?.codeDepartement ?? []}
          menuZIndex={3}
        >
          Département
        </Multiselect>
        <Multiselect
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="15rem"
          onChange={(selected) => handleFilters("commune", selected)}
          options={filtersList?.communes}
          value={searchParams.filters?.commune ?? []}
          menuZIndex={3}
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
