import { Checkbox, Flex, Select, Text } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { Formations } from "@/app/(wrapped)/console/formations/types";
import { Multiselect } from "@/components/Multiselect";

import { Filters, Order } from "../types";

export const ConsoleFilters = ({
  setCodeRegionFilter,
  setSearchParams,
  searchParams,
  data,
}: {
  setCodeRegionFilter: (codeRegion: string) => void;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: string;
  };
  data?: Formations;
}) => {
  const trackEvent = usePlausible();

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
    setSearchParams({
      page: 0,
      filters: { ...filters, [type]: value },
      withAnneeCommune,
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
        onClose={filterTracker("codeDiplome")}
        width="12rem"
        onChange={(selected) => handleFilters("codeDiplome", selected)}
        options={data?.filters.diplomes}
        value={filters.codeDiplome ?? []}
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
        width="12rem"
        onClose={filterTracker("cpc")}
        onChange={(selected) => handleFilters("cpc", selected)}
        options={data?.filters.cpcs}
        value={filters.cpc ?? []}
        menuZIndex={3}
      >
        CPC
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
      <Flex w="24rem" mr="3">
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
    </Flex>
  );
};
