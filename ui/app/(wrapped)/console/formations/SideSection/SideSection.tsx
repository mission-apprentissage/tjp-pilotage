import { Button, Checkbox, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { useContext, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { CodeRegionFilterContext } from "@/app/layoutClient";
import { DoubleArrowLeft } from "@/components/icons/DoubleArrowLeft";
import { DoubleArrowRight } from "@/components/icons/DoubleArrowRight";
import { Multiselect } from "@/components/Multiselect";

import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, FiltersList, Order } from "../types";

export const SideSection = ({
  setSearchParams,
  searchParams,
  filtersList,
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
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
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

  const handleToggleShowAnneeCommune = (value: string) => {
    setSearchParams({
      withAnneeCommune: value,
    });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("formations:filtre", { props: { filter_name: filterName } });
  };

  useEffect(() => {
    if (codeRegionFilter !== "" && !filters.codeRegion?.length) {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  return (
    <Flex
      gap={3}
      direction={"column"}
      bgColor={"bluefrance.975"}
      p={2}
      flex={"shrink"}
    >
      {isOpen ? (
        <Button
          variant="externalLink"
          leftIcon={<DoubleArrowLeft />}
          onClick={() => onToggle()}
          cursor="pointer"
          px={3}
        >
          Masquer les filtres
        </Button>
      ) : (
        <Button
          variant="externalLink"
          rightIcon={<DoubleArrowRight />}
          onClick={() => onToggle()}
          cursor="pointer"
        />
      )}
      {isOpen && (
        <Flex gap={4} direction={"column"} mt={5}>
          <Multiselect
            display={["none", null, "flex"]}
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
          >
            Diplôme
          </Multiselect>
          <Multiselect
            display={["none", null, "flex"]}
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
          <Flex>
            <Checkbox
              size="lg"
              variant="accessible"
              onChange={(event) => {
                handleToggleShowAnneeCommune(
                  event.target.checked.toString() ?? "false"
                );
              }}
              isChecked={searchParams.withAnneeCommune !== "false"}
              whiteSpace={"nowrap"}
              mx={"auto"}
            >
              <Text fontSize={"14px"}>2nde et 1ère communes</Text>
            </Checkbox>
          </Flex>
          <Multiselect
            display={["none", null, "flex"]}
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
            display={["none", null, "flex"]}
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
            disabled={filters.codeRegion === undefined}
            menuZIndex={10000}
          >
            Position dans le quadrant
          </Multiselect>
        </Flex>
      )}
    </Flex>
  );
};
