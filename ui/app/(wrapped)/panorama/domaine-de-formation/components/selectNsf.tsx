import { chakra, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import type { CSSObjectWithLabel, StylesConfig } from "react-select";
import Select from "react-select";

import { client } from "@/api.client";
import type { NsfOption, NsfOptions } from "@/app/(wrapped)/panorama/domaine-de-formation/types";

const selectStyle: StylesConfig<NsfOption, false> = {
  control: (styles: CSSObjectWithLabel) => ({
    ...styles,
    width: "100%",
    zIndex: "2",
    borderColor: "#dddddd",
  }),
  input: (styles) => ({ ...styles, width: "100%" }),
  menu: (styles) => ({ ...styles, width: "100%" }),
  container: (styles) => ({ ...styles, width: "100%" }),
  groupHeading: (styles) => ({
    ...styles,
    fontWeight: "bold",
    color: "#161616",
    fontSize: "14px",
  }),
  placeholder: (styles) => ({
    ...styles,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

export const SelectNsf = chakra(
  ({
    defaultNsfs,
    defaultSelected = null,
    className,
    isClearable = true,
    routeSelectedNsf,
  }: {
    defaultNsfs: NsfOptions;
    defaultSelected: NsfOption | null;
    className?: string;
    isClearable?: boolean;
    routeSelectedNsf: (selected: NsfOption) => void;
  }) => {
    const [search, setSearch] = useState<string>("");

    const { data, isLoading, refetch } = client
      .ref("[GET]/domaine-de-formation")
      .useQuery({ query: { search } }, { enabled: !!search, initialData: defaultNsfs });

    const onNsfSelected = (selected: NsfOption | null) => {
      if (selected) {
        routeSelectedNsf(selected);
      }
    };

    return (
      <Flex flexDirection="column" gap="2" className={className}>
        <Flex width="100%">
          <FormControl>
            <FormLabel htmlFor="nsf-select">
              Rechercher un domaine de formation (NSF) ou par formation
            </FormLabel>
            <Select
              inputId="nsf-select"
              noOptionsMessage={({ inputValue }) =>
                inputValue ? "Pas de formation correspondant à votre recherche" : "Commencez à écrire..."
              }
              isLoading={isLoading}
              inputValue={search}
              defaultValue={defaultSelected}
              options={[
                {
                  label: `DOMAINES DE FORMATION (${(data ?? []).filter((option) => option.type === "nsf").length})`,
                  options: (data ?? []).filter((option) => option.type === "nsf"),
                },
                {
                  label: `FORMATIONS (${(data ?? []).filter((option) => option.type === "formation").length})`,
                  options: (data ?? []).filter((option) => option.type === "formation"),
                },
              ]}
              onChange={(selected) => onNsfSelected(selected as NsfOption)}
              onInputChange={(value) => setSearch(value)}
              isSearchable={true}
              onMenuOpen={async () => refetch()}
              onMenuClose={() => setSearch("")}
              placeholder="Saisir un nom de domaine, un libellé de formation, un code diplôme..."
              styles={selectStyle}
              isMulti={false}
              isClearable={isClearable}
            />
          </FormControl>
        </Flex>
      </Flex>
    );
  }
);
