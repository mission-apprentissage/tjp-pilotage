import { chakra, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CSSProperties, useState } from "react";
import Select, { CSSObjectWithLabel, StylesConfig } from "react-select";

import { client } from "../../../../../api.client";
import { NsfOption, NsfOptions } from "../types";

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
};

export const SelectNsf = chakra(
  ({
    defaultNsfs,
    defaultSelected = null,
    hideLabel = false,
    className,
  }: {
    defaultNsfs: NsfOptions;
    defaultSelected: NsfOption | null;
    hideLabel?: boolean;
    className?: string;
  }) => {
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const [selectedNsf, setSelectedNsf] = useState<NsfOption | null>(
      defaultSelected
    );

    const { data, isLoading, refetch } = client
      .ref("[GET]/domaine-de-formation")
      .useQuery(
        { query: { search } },
        { enabled: !!search, initialData: defaultNsfs }
      );

    const onNsfSelected = (selected: NsfOption | null) => {
      if (selected) {
        setSelectedNsf(selected);
        if (selected.type === "formation") {
          router.push(
            `/domaine-de-formation/${selected.nsf}?cfd=${selected.value}`
          );
        } else {
          router.push(`/domaine-de-formation/${selected.value}`);
        }
      }
    };

    const labelStyle: CSSProperties = {
      fontWeight: "bold",
      display: hideLabel ? "none" : "block",
    };

    return (
      <Flex flexDirection="column" gap="2" className={className}>
        <label htmlFor="nsf-select" style={labelStyle}>
          Rechercher un domaine de formation (NSF) ou par formation
        </label>
        <Flex width="100%">
          <Select
            id="nsf-select"
            noOptionsMessage={({ inputValue }) =>
              inputValue
                ? "Pas de formation correspondant à votre recherche"
                : "Commencez à écrire..."
            }
            isLoading={isLoading}
            inputValue={search}
            value={selectedNsf}
            options={[
              {
                label: `DOMAINES DE FORMATION (${
                  (data ?? []).filter((option) => option.type === "nsf").length
                })`,
                options: (data ?? []).filter((option) => option.type === "nsf"),
              },
              {
                label: `FORMATIONS (${
                  (data ?? []).filter((option) => option.type === "formation")
                    .length
                })`,
                options: (data ?? []).filter(
                  (option) => option.type === "formation"
                ),
              },
            ]}
            onChange={(selected) => onNsfSelected(selected as NsfOption)}
            onInputChange={(value) => setSearch(value)}
            isSearchable={true}
            onMenuOpen={() => refetch()}
            onMenuClose={() => setSearch("")}
            placeholder="Saisir un nom de domaine, un libellé de formation, un code diplôme..."
            styles={selectStyle}
            isMulti={false}
          />
        </Flex>
      </Flex>
    );
  }
);
