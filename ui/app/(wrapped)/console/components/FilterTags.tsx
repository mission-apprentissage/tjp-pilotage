import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, IconButton, Tag, Text, Tooltip, Wrap } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { useAuth } from "@/utils/security/useAuth";

import type { Filters, FiltersList } from "./types";

enum FILTRES_KEYS {
  "codeRegion" = "regions",
  "codeAcademie" = "academies",
  "codeDepartement" = "departements",
  "commune" = "communes",
  "secteur" = "secteurs",
  "uai" = "etablissements",
  "codeNiveauDiplome" = "diplomes",
  "codeDispositif" = "dispositifs",
  "codeNsf" = "libellesNsf",
  "cfd" = "formations",
  "cfdFamille" = "familles",
  "positionQuadrant" = "positionsQuadrant",
  "rentreeScolaire" = "rentreesScolaires",
}

export const FilterTags = chakra(
  ({
    filters,
    filtersList,
    handleFilters,
    isEditable = false,
  }: {
    filters?: Partial<Filters>;
    filtersList?: FiltersList;
    handleFilters?: (type: keyof Filters, value: Filters[keyof Filters]) => void;
    isEditable?: boolean;
  }) => {
    const { user } = useAuth();
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

    const getFilterValue = ({ key, value }: { key: string; value: string }) => {
      return filtersList?.[FILTRES_KEYS[key as keyof typeof FILTRES_KEYS] as keyof FiltersList]?.find(
        (filter) => filter.value === value
      )?.label;
    };

    const shouldShowUserIcon = ({ key, value }: { key: string; value: string }) =>
      (key === "uai" && user?.uais?.includes(value)) ||
      (key === "codeRegion" && user?.codeRegion === value);

    const [shouldShowAllFilters, setShouldShowAllFilters] = useState<boolean>(false);

    if (!filters) return <Box h={9} />;

    return (
      <Box minH={9}>
        <Wrap spacing={2}>
          {Object.values(flattenFilters(filters))
            .filter(({ value }) => value)
            .slice(0, shouldShowAllFilters ? undefined : 5)
            .map(({ key, value }) => {
              return (
                getFilterValue({ key, value }) && (
                  <Tooltip key={`${key}-${value}`} label={getFilterValue({ key, value })}>
                    <Tag
                      size="lg"
                      bgColor={shouldShowUserIcon({ key, value }) ? "blueecume.925" : "bluefrance.525"}
                      color={shouldShowUserIcon({ key, value }) ? "bluefrance.113" : "white"}
                      borderRadius={12}
                      w={"fit-content"}
                      h={"fit-content"}
                      gap={1}
                    >
                      {shouldShowUserIcon({ key, value }) && <Icon icon="ri:user-line" width={16} height={16} />}
                      <Text maxW={56} whiteSpace="nowrap" textOverflow="ellipsis" overflowX="clip">
                        {getFilterValue({ key, value })}
                      </Text>
                      {isEditable && handleFilters && (
                        <IconButton
                          aria-label="Supprimer le filtre"
                          variant={"unstyled"}
                          size="xs"
                          onClick={() => {
                            const filterValue = filters[key as keyof Filters];
                            // If filterValue is an array and has more than one value, remove the value from the array
                            if (filterValue && Array.isArray(filterValue) && filterValue.length > 1) {
                              handleFilters(
                                key as keyof Filters,
                                filterValue.filter((v) => v !== value)
                              );
                              return;
                            }
                            handleFilters(key as keyof Filters, undefined);
                          }}
                          icon={<CloseIcon />}
                        />
                      )}
                    </Tag>
                  </Tooltip>
                )
              );
            })}
          {Object.values(flattenFilters(filters)).length > 5 && !shouldShowAllFilters && (
            <Button
              variant="link"
              color="bluefrance.525"
              onClick={() => setShouldShowAllFilters(true)}
              ms={4}
              my={"auto"}
            >
              Voir tous ({Object.values(flattenFilters(filters)).length})
            </Button>
          )}
        </Wrap>
      </Box>
    );
  }
);
