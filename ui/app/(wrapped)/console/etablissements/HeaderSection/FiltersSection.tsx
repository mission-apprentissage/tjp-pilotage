import { Button, Flex, Select } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import { useContext, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { CodeRegionFilterContext, UaiFilterContext } from "@/app/layoutClient";
import { Multiselect } from "@/components/Multiselect";

import { FORMATION_ETABLISSEMENT_COLUMNS } from "../FORMATION_ETABLISSEMENT_COLUMNS";
import { Filters, FiltersList, Order } from "../types";

export const FiltersSection = ({
  setSearchParams,
  searchParams,
  filtersList,
}: {
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    order?: Partial<Order>;
    page?: string;
  };
  filtersList?: FiltersList;
}) => {
  const trackEvent = usePlausible();
  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  const { uaiFilter, setUaiFilter } = useContext(UaiFilterContext);

  const filters = searchParams.filters ?? {};
  const withAnneeCommune = searchParams.withAnneeCommune ?? "true";
  const handleFiltersContext = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    if (type === "uai" && value != null)
      setUaiFilter((value as string[])[0] ?? "");
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
            secteur: [],
            uai: [],
          };
        }
        break;
      case "codeAcademie":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            codeDepartement: undefined,
            commune: undefined,
            secteur: [],
            uai: [],
          };
        }
        break;
      case "codeDepartement":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            commune: undefined,
            secteur: [],
            uai: [],
          };
        }
        break;
      case "commune":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            secteur: [],
            uai: [],
          };
        }
        break;
      case "secteur":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            uai: [],
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

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("etablissements:filtre", { props: { filter_name: filterName } });
  };

  const resetFilters = () => {
    trackEvent("etablissements:filtre", { props: { filter_name: "reset" } });
    setSearchParams({
      filters: {
        ...filters,
        codeRegion: [],
        codeAcademie: [],
        codeDepartement: [],
        commune: [],
        uai: [],
        secteur: undefined,
        codeNiveauDiplome: [],
        codeDispositif: [],
        cfdFamille: [],
        cfd: [],
        codeNsf: [],
      },
    });
  };

  useEffect(() => {
    if (codeRegionFilter !== "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
    if (uaiFilter !== "") {
      filters.uai = [uaiFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  return (
    <Flex gap={3} wrap={"wrap"} p={4} py={8} bgColor="bluefrance.950">
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
