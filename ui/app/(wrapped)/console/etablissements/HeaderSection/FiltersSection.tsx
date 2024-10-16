import { Button, Checkbox, Flex, Select, Text } from "@chakra-ui/react";
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
  filtersLists,
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
  filtersLists?: FiltersList;
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

  const handleToggleShowAnneeCommune = (value: string) => {
    setSearchParams({
      withAnneeCommune: value,
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
    <Flex justify={"flex-end"} gap={3} wrap={"wrap"} py="3">
      <Select
        placeholder="Toutes les régions"
        width="12rem"
        variant="input"
        size="sm"
        onChange={(e) => {
          handleFilters("codeRegion", [e.target.value]);
        }}
        value={filters.codeRegion?.[0] ?? ""}
      >
        {filtersLists?.regions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      <Multiselect
        disabled={!filters.codeRegion}
        onClose={filterTracker("codeAcademie")}
        width="12rem"
        onChange={(selected) => handleFilters("codeAcademie", selected)}
        options={filtersLists?.academies}
        value={filters.codeAcademie ?? []}
        menuZIndex={3}
      >
        Académie
      </Multiselect>
      <Multiselect
        disabled={!filters.codeRegion}
        onClose={filterTracker("codeDepartement")}
        width="12rem"
        onChange={(selected) => handleFilters("codeDepartement", selected)}
        options={filtersLists?.departements}
        value={filters.codeDepartement ?? []}
        menuZIndex={3}
      >
        Département
      </Multiselect>
      <Multiselect
        disabled={!filters.codeRegion}
        onClose={filterTracker("commune")}
        width="12rem"
        onChange={(selected) => handleFilters("commune", selected)}
        options={filtersLists?.communes}
        value={filters.commune ?? []}
        menuZIndex={3}
      >
        Commune
      </Multiselect>
      <Multiselect
        onClose={filterTracker("secteur")}
        width="12rem"
        onChange={(selected) => handleFilters("secteur", selected)}
        options={filtersLists?.secteurs}
        value={filters.secteur ?? []}
        menuZIndex={3}
      >
        Secteur
      </Multiselect>
      <Multiselect
        onClose={filterTracker("uai")}
        width="12rem"
        onChange={(selected) => handleFilters("uai", selected)}
        options={filtersLists?.etablissements}
        value={filters.uai ?? []}
        menuZIndex={3}
      >
        Établissement
      </Multiselect>
      <Multiselect
        onClose={filterTracker("codeNiveauDiplome")}
        width="12rem"
        onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
        options={filtersLists?.diplomes}
        value={filters.codeNiveauDiplome ?? []}
        menuZIndex={3}
      >
        Diplôme
      </Multiselect>
      <Multiselect
        onClose={filterTracker("codeDispositif")}
        width="12rem"
        onChange={(selected) => handleFilters("codeDispositif", selected)}
        options={filtersLists?.dispositifs}
        value={filters.codeDispositif ?? []}
        menuZIndex={3}
      >
        Dispositif
      </Multiselect>
      <Multiselect
        onClose={filterTracker("cfdFamille")}
        width="12rem"
        onChange={(selected) => handleFilters("cfdFamille", selected)}
        options={filtersLists?.familles}
        value={filters.cfdFamille ?? []}
        menuZIndex={3}
      >
        Famille
      </Multiselect>
      <Multiselect
        onClose={filterTracker("cfd")}
        width="12rem"
        onChange={(selected) => handleFilters("cfd", selected)}
        options={filtersLists?.formations}
        value={filters.cfd ?? []}
        menuZIndex={3}
      >
        Formation
      </Multiselect>
      <Multiselect
        onClose={filterTracker("codeNsf")}
        width="12rem"
        onChange={(selected) => handleFilters("codeNsf", selected)}
        options={filtersLists?.libellesNsf}
        value={filters.codeNsf ?? []}
        menuZIndex={3}
      >
        Domaine de formation (NSF)
      </Multiselect>
      <Flex w="24rem">
        <Checkbox
          size="lg"
          onChange={(event) => {
            handleToggleShowAnneeCommune(
              event.target.checked.toString() ?? "false"
            );
          }}
          isChecked={searchParams.withAnneeCommune !== "false"}
          whiteSpace={"nowrap"}
        >
          <Text fontSize={"14px"}>
            Afficher les secondes et premières communes
          </Text>
        </Checkbox>
      </Flex>
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
