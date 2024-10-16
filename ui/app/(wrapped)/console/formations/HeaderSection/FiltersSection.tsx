import { Button, Checkbox, Flex, Select, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import { useContext, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { CodeRegionFilterContext } from "@/app/layoutClient";
import { Multiselect } from "@/components/Multiselect";

import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, Formations, Order } from "../types";

export const FiltersSection = ({
  setSearchParams,
  searchParams,
  data,
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
  data?: Formations;
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

  const handleToggleShowAnneeCommune = (value: string) => {
    setSearchParams({
      withAnneeCommune: value,
    });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("formations:filtre", { props: { filter_name: filterName } });
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
      },
      search: "",
    });
  };

  useEffect(() => {
    if (codeRegionFilter !== "" && !filters.codeRegion?.length) {
      filters.codeRegion = [codeRegionFilter];
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
        {data?.filters.regions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
      <Multiselect
        display={["none", null, "flex"]}
        disabled={!filters.codeRegion}
        onClose={filterTracker("codeAcademie")}
        width="12rem"
        onChange={(selected) => handleFilters("codeAcademie", selected)}
        options={data?.filters.academies}
        value={filters.codeAcademie ?? []}
        menuZIndex={3}
      >
        Académie
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        disabled={!filters.codeRegion}
        onClose={filterTracker("codeDepartement")}
        width="12rem"
        onChange={(selected) => handleFilters("codeDepartement", selected)}
        options={data?.filters.departements}
        value={filters.codeDepartement ?? []}
        menuZIndex={3}
      >
        Département
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        disabled={!filters.codeRegion}
        onClose={filterTracker("commune")}
        width="12rem"
        onChange={(selected) => handleFilters("commune", selected)}
        options={data?.filters.communes}
        value={filters.commune ?? []}
        menuZIndex={3}
      >
        Commune
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        onClose={filterTracker("codeNiveauDiplome")}
        width="12rem"
        onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
        options={data?.filters.diplomes}
        value={filters.codeNiveauDiplome ?? []}
        menuZIndex={3}
      >
        Diplôme
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        onClose={filterTracker("codeDispositif")}
        width="12rem"
        onChange={(selected) => handleFilters("codeDispositif", selected)}
        options={data?.filters.dispositifs}
        value={filters.codeDispositif ?? []}
        menuZIndex={3}
      >
        Dispositif
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        onClose={filterTracker("cfdFamille")}
        width="12rem"
        onChange={(selected) => handleFilters("cfdFamille", selected)}
        options={data?.filters.familles}
        value={filters.cfdFamille ?? []}
        menuZIndex={3}
      >
        Famille
      </Multiselect>
      <Multiselect
        onClose={filterTracker("cfd")}
        width="12rem"
        onChange={(selected) => handleFilters("cfd", selected)}
        options={data?.filters.formations}
        value={filters.cfd ?? []}
        menuZIndex={3}
      >
        Formation
      </Multiselect>
      <Multiselect
        display={["none", null, "flex"]}
        onClose={filterTracker("codeNsf")}
        width="12rem"
        onChange={(selected) => handleFilters("codeNsf", selected)}
        options={data?.filters.libellesNsf}
        value={filters.codeNsf ?? []}
        menuZIndex={3}
      >
        Domaine de formation (NSF)
      </Multiselect>
      <Flex w="24rem">
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
