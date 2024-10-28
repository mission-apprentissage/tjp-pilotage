import { Button, Checkbox, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { useContext, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { CodeRegionFilterContext } from "@/app/layoutClient";
import { DoubleArrowLeft } from "@/components/icons/DoubleArrowLeft";
import { DoubleArrowRight } from "@/components/icons/DoubleArrowRight";
import { Multiselect } from "@/components/Multiselect";

import { FORMATION_ETABLISSEMENT_COLUMNS } from "../FORMATION_ETABLISSEMENT_COLUMNS";
import { Filters, FiltersList, Order } from "../types";

export const SideSection = ({
  setSearchParams,
  searchParams,
  filtersList,
}: {
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    order?: Partial<Order>;
    page?: string;
  };
  filtersList?: FiltersList;
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const trackEvent = usePlausible();

  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  const filters = searchParams.filters ?? {};

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
      });
    });
  };

  const handleToggleShowAnneeCommune = (value: string) => {
    setSearchParams({
      filters: {
        withAnneeCommune: value,
      },
    });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("formations:filtre", { props: { filter_name: filterName } });
  };

  useEffect(() => {
    if (codeRegionFilter !== "" && !filters.codeRegion?.length) {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters });
    }
  }, []);

  return (
    <Flex
      flex={"shrink"}
      direction={"column"}
      bgColor={"bluefrance.975"}
      p={2}
      gap={5}
    >
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
            onClose={filterTracker("secteur")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("secteur", selected)}
            options={filtersList?.secteurs}
            value={filters.secteur ?? []}
            menuZIndex={3}
          >
            Secteur
          </Multiselect>
          <Multiselect
            onClose={filterTracker("uai")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("uai", selected)}
            options={filtersList?.etablissements}
            value={filters.uai ?? []}
            menuZIndex={3}
          >
            Établissement
          </Multiselect>
          <Flex>
            <Checkbox
              variant="accessible"
              mx={"auto"}
              size="lg"
              onChange={(event) => {
                handleToggleShowAnneeCommune(
                  event.target.checked.toString() ?? "false"
                );
              }}
              isChecked={searchParams.filters?.withAnneeCommune !== "false"}
              whiteSpace={"nowrap"}
            >
              <Text fontSize={"14px"}>2nde et 1ère communes</Text>
            </Checkbox>
          </Flex>
          <Multiselect
            onClose={filterTracker("codeNiveauDiplome")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) =>
              handleFilters("codeNiveauDiplome", selected)
            }
            options={filtersList?.diplomes}
            value={filters.codeNiveauDiplome ?? []}
            menuZIndex={3}
            mt={5}
          >
            Diplôme
          </Multiselect>
          <Multiselect
            onClose={filterTracker("codeDispositif")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("codeDispositif", selected)}
            options={filtersList?.dispositifs}
            value={filters.codeDispositif ?? []}
            menuZIndex={3}
          >
            Dispositif
          </Multiselect>
          <Multiselect
            onClose={filterTracker("cfdFamille")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("cfdFamille", selected)}
            options={filtersList?.familles}
            value={filters.cfdFamille ?? []}
            menuZIndex={3}
          >
            Famille
          </Multiselect>
          <Multiselect
            onClose={filterTracker("cfd")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("cfd", selected)}
            options={filtersList?.formations}
            value={filters.cfd ?? []}
            menuZIndex={3}
          >
            Formation
          </Multiselect>
          <Multiselect
            onClose={filterTracker("codeNsf")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("codeNsf", selected)}
            options={filtersList?.libellesNsf}
            value={filters.codeNsf ?? []}
            menuZIndex={3}
          >
            Domaine de formation (NSF)
          </Multiselect>
          <Multiselect
            display={["none", null, "flex"]}
            onClose={filterTracker("positionQuadrant")}
            size="md"
            variant="newInput"
            width="18rem"
            onChange={(selected) => handleFilters("positionQuadrant", selected)}
            options={filtersList?.positionsQuadrant}
            value={filters.positionQuadrant ?? []}
            menuZIndex={10000}
          >
            Position dans le quadrant
          </Multiselect>
        </Flex>
      )}
    </Flex>
  );
};
