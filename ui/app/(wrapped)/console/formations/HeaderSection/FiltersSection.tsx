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
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import { useContext, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import { RequetesEnregistrees } from "@/app/(wrapped)/console/formations/types";
import { CodeRegionFilterContext } from "@/app/layoutClient";
import { Multiselect } from "@/components/Multiselect";

import { DeleteRequeteEnregistreeButton } from "../components/DeleteRequeteEnregistreeButton";
import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, FiltersList, Order } from "../types";

const REQUETES_ENREGISTREES = [
  {
    value: {},
    nom: "Transition écologique",
    couleur: "green.submitted",
  },
  {
    value: {
      positionQuadrant: [PositionQuadrantEnum["Q4"]],
    },
    nom: "Action prioritaire",
    couleur: "redmarianne.625_hover",
  },
];

export const FiltersSection = ({
  setSearchParams,
  searchParams,
  filtersList,
  requetesEnregistrees,
}: {
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: string;
  };
  filtersList?: FiltersList;
  requetesEnregistrees?: RequetesEnregistrees;
}) => {
  const trackEvent = usePlausible();

  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  const filters = searchParams.filters ?? {};
  const withAnneeCommune = searchParams.withAnneeCommune ?? "true";

  const handleFiltersContext = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    if (type === "codeRegion" && value != null)
      setCodeRegionFilter((value as string[])[0] ?? "");
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    handleFiltersContext(type, value);

    let newFilters: Partial<Filters> = {
      [type]: value,
    };

    // Valeurs par défaut pour les codes
    switch (type) {
      case "codeRegion":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            codeAcademie: undefined,
            codeDepartement: undefined,
            commune: undefined,
          };
        }
        break;
      case "codeAcademie":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            codeDepartement: undefined,
            commune: undefined,
          };
        }
        break;
      case "codeDepartement":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            commune: undefined,
          };
        }
        break;
    }

    unstable_batchedUpdates(() => {
      setSearchParams({
        page: 0,
        filters: { ...filters, ...newFilters },
        withAnneeCommune,
      });
    });
  };

  const resetFilters = () => {
    setSearchParams({
      filters: {
        ...filters,
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
  };

  const [requeteEnregistreeActuelle, setRequeteEnregistreeActuelle] = useState<{
    nom: string;
    couleur?: string;
  }>({ nom: "Requêtes pré-sauvegardées" });

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("formations:filtre", { props: { filter_name: filterName } });
  };

  useEffect(() => {
    if (codeRegionFilter !== "" && !filters.codeRegion?.length) {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  const [deleteButtonToDisplay, setDeleteButtonToDisplay] =
    useState<string>("");

  return (
    <Flex gap={3} wrap={"wrap"} p={4} py={8} bgColor="bluefrance.950">
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
          <MenuList py={0} borderTopRadius={0} minW={"fit-content"} zIndex={3}>
            <Text p={2} color="grey.425">
              Requêtes populaires
            </Text>
            {REQUETES_ENREGISTREES.map((requeteEnregistree) => (
              <MenuItem
                p={2}
                key={requeteEnregistree.nom}
                onClick={() => {
                  resetFilters();
                  setSearchParams({
                    ...searchParams,
                    page: 0,
                    filters: {
                      ...searchParams.filters,
                      ...requeteEnregistree.value,
                    },
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
            {requetesEnregistrees && requetesEnregistrees.length > 0 && (
              <>
                <Divider />
                <Text p={2} color="grey.425">
                  Vos requêtes favoris
                </Text>
                {requetesEnregistrees?.map((requete) => (
                  <MenuItem
                    p={2}
                    key={requete.id}
                    onClick={() => {
                      resetFilters();
                      setSearchParams({
                        ...searchParams,
                        page: 0,
                        filters: {
                          ...searchParams.filters,
                          ...requete.filtres,
                        },
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
              </>
            )}
          </MenuList>
        </Portal>
      </Menu>
      <Select
        placeholder="Toutes les régions"
        size="md"
        variant="newInput"
        width="20rem"
        onChange={(e) => {
          handleFiltersContext("codeRegion", [e.target.value]);
          setSearchParams({
            page: 0,
            filters: {
              ...filters,
              codeAcademie: undefined,
              codeDepartement: undefined,
              commune: undefined,
              codeRegion: e.target.value === "" ? undefined : [e.target.value],
            },
          });
        }}
        value={filters.codeRegion?.[0] ?? ""}
      >
        {filtersList?.regions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      <Multiselect
        display={["none", null, "flex"]}
        disabled={!filters.codeRegion}
        onClose={filterTracker("codeAcademie")}
        size="md"
        variant="newInput"
        width="20rem"
        onChange={(selected) => handleFilters("codeAcademie", selected)}
        options={filtersList?.academies}
        value={filters.codeAcademie ?? []}
        menuZIndex={3}
      >
        Académie
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        disabled={!filters.codeRegion}
        onClose={filterTracker("codeDepartement")}
        size="md"
        variant="newInput"
        width="20rem"
        onChange={(selected) => handleFilters("codeDepartement", selected)}
        options={filtersList?.departements}
        value={filters.codeDepartement ?? []}
        menuZIndex={3}
      >
        Département
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        disabled={!filters.codeRegion}
        onClose={filterTracker("commune")}
        size="md"
        variant="newInput"
        width="20rem"
        onChange={(selected) => handleFilters("commune", selected)}
        options={filtersList?.communes}
        value={filters.commune ?? []}
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
    </Flex>
  );
};
