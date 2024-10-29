import { CloseIcon } from "@chakra-ui/icons";
import { chakra, Flex, IconButton, Tag } from "@chakra-ui/react";

import { Filters, FiltersList } from "./types";

enum FILTRES_KEYS {
  "codeRegion" = "regions",
  "codeAcademie" = "academies",
  "codeDepartement" = "departements",
  "commune" = "communes",
  "secteur" = "secteurs",
  "uai" = "uais",
  "codeNiveauDiplome" = "diplomes",
  "codeDispositif" = "dispositifs",
  "codeNsf" = "libellesNsf",
  "cfd" = "formations",
  "cfdFamille" = "familles",
  "positionQuadrant" = "positionsQuadrant",
}

export const FilterTags = chakra(
  ({
    filters,
    filtersList,
    setSearchParams,
    isEditable = false,
  }: {
    filters?: Partial<Filters>;
    filtersList?: FiltersList;
    setSearchParams?: (params: { filters?: Partial<Filters> }) => void;
    isEditable?: boolean;
  }) => {
    /**
     *  Flatten filters object to array of { key, value }
     *
     * example :
     *
     * filters[codeRegion][0]=XXX&filters[codeRegion][1]=YYY in URL
     * or filters[codeRegion]=['XXX', 'YYY'] in searchParams becomes
     *
     * [{ key: "codeRegion", value: "XXX" }, { key: "codeRegion", value: "YYY" }]
     *
     * to be able to display the filters as independant tags
     */
    const flattenFilters = (filters?: Partial<Filters>) => {
      if (!filters) return [];
      return Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            return [...acc, ...value.map((v) => ({ key, value: v }))];
          }
          return [...acc, { key, value }];
        },
        [] as Array<{ key: string; value: string }>
      );
    };

    const getFilterValue = (key: string, value: string | Array<string>) => {
      if (typeof value === "string") {
        return filtersList?.[
          FILTRES_KEYS[key as keyof typeof FILTRES_KEYS] as keyof FiltersList
        ]?.find((filter) => filter.value === value)?.label;
      }
      return value
        .map(
          (v) =>
            filtersList?.[
              FILTRES_KEYS[
                key as keyof typeof FILTRES_KEYS
              ] as keyof FiltersList
            ]?.find((filter) => filter.value === v)?.label
        )
        .join(", ");
    };

    if (!filters) return <></>;

    return (
      <Flex gap={3} minH={9}>
        {Object.values(flattenFilters(filters))
          .filter(({ value }) => value)
          .map(({ key, value }) => {
            return (
              getFilterValue(key, value) && (
                <Tag
                  key={`${key}-${value}`}
                  size="lg"
                  bgColor="bluefrance.525"
                  color={"white"}
                  borderRadius={12}
                  w={"fit-content"}
                  h={"fit-content"}
                  gap={1}
                >
                  {getFilterValue(key, value)}
                  {isEditable && setSearchParams && (
                    <IconButton
                      aria-label="Supprimer le filtre"
                      variant={"unstyled"}
                      size="xs"
                      onClick={() => {
                        const filterValue = filters[key as keyof Filters];
                        // If filterValue is an array and has more than one value, remove the value from the array
                        if (
                          filterValue &&
                          Array.isArray(filterValue) &&
                          filterValue.length > 1
                        ) {
                          setSearchParams({
                            filters: {
                              ...filters,
                              [key]: filterValue.filter((v) => v !== value),
                            },
                          });
                          return;
                        }
                        setSearchParams({
                          filters: { ...filters, [key]: undefined },
                        });
                      }}
                      icon={<CloseIcon />}
                    />
                  )}
                </Tag>
              )
            );
          })}
      </Flex>
    );
  }
);
