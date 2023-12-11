import { Box, Flex, FormLabel, Select, Skeleton } from "@chakra-ui/react";

import { Multiselect } from "../../../../../components/Multiselect";
import {
  Filters,
  PilotageTransformationStats,
  TerritoiresFilters,
} from "../types";

export const FiltersSection = ({
  activeTerritoiresFilters,
  handleTerritoiresFilters,
  activeFilters,
  handleFilters,
  filterTracker,
  isLoading,
  data,
}: {
  activeTerritoiresFilters: TerritoiresFilters;
  handleTerritoiresFilters: (
    type: keyof TerritoiresFilters,
    value: TerritoiresFilters[keyof TerritoiresFilters],
    label?: string
  ) => void;
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
  isLoading: boolean;
  data?: PilotageTransformationStats;
}) => {
  return (
    <>
      {isLoading ? (
        <Box height={48}>
          <Skeleton
            opacity="0.3"
            width="100%"
            height={"100%"}
            py={4}
            px={8}
          ></Skeleton>
        </Box>
      ) : (
        <Box borderRadius={4}>
          <Flex justifyContent={"start"} gap={8} py={3}>
            <Box justifyContent={"start"}>
              <FormLabel>Rentrée scolaire</FormLabel>
              <Select width={"72"} size="md" variant="newInput">
                <option>2024</option>
                <option disabled>2025</option>
                <option disabled>2026</option>
                <option disabled>2027</option>
              </Select>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Région</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.regions ?? ""}
                borderBottomColor={
                  activeTerritoiresFilters.regions != undefined
                    ? "info.525"
                    : ""
                }
                onChange={(e) =>
                  handleTerritoiresFilters(
                    "regions",
                    e.target.value,
                    e.target[e.target.selectedIndex].textContent ?? ""
                  )
                }
                placeholder="TOUTES"
              >
                {data?.filters?.regions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Académie</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.academies ?? ""}
                borderBottomColor={
                  activeTerritoiresFilters.academies != undefined
                    ? "info.525"
                    : ""
                }
                onChange={(e) =>
                  handleTerritoiresFilters(
                    "academies",
                    e.target.value,
                    e.target[e.target.selectedIndex].textContent ?? ""
                  )
                }
                placeholder="TOUTES"
              >
                {data?.filters?.academies?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Département</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.departements ?? ""}
                borderBottomColor={
                  activeTerritoiresFilters.departements != undefined
                    ? "info.525"
                    : ""
                }
                onChange={(e) =>
                  handleTerritoiresFilters(
                    "departements",
                    e.target.value,
                    e.target[e.target.selectedIndex].textContent ?? ""
                  )
                }
                placeholder="TOUS"
              >
                {data?.filters?.departements?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
          <Flex justifyContent={"start"} gap={8} py={3}>
            <Box justifyContent={"start"}>
              <FormLabel>Diplôme</FormLabel>
              <Multiselect
                onClose={filterTracker("codeNiveauDiplome")}
                width={"72"}
                size="md"
                variant={"newInput"}
                onChange={(selected) =>
                  handleFilters("codeNiveauDiplome", selected)
                }
                options={data?.filters.diplomes}
                value={activeFilters.codeNiveauDiplome ?? []}
                disabled={data?.filters.diplomes.length === 0}
              >
                TOUS ({data?.filters.diplomes.length ?? 0})
              </Multiselect>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>CPC</FormLabel>
              <Multiselect
                onClose={filterTracker("CPC")}
                width={"72"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("CPC", selected)}
                options={data?.filters.CPCs}
                value={activeFilters.CPC ?? []}
                disabled={data?.filters.CPCs.length === 0}
                hasDefaultValue={false}
              >
                TOUS ({data?.filters.CPCs.length ?? 0})
              </Multiselect>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Secteur d'activité</FormLabel>
              <Multiselect
                onClose={filterTracker("filiere")}
                width={"72"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("filiere", selected)}
                options={data?.filters.filieres}
                value={activeFilters.filiere ?? []}
                disabled={data?.filters.filieres.length === 0}
                hasDefaultValue={false}
              >
                TOUS ({data?.filters.filieres.length ?? 0})
              </Multiselect>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};
