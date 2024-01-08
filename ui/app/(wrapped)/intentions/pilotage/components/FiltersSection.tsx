import { Box, FormLabel, Select, SimpleGrid, Skeleton } from "@chakra-ui/react";

import { Multiselect } from "../../../../../components/Multiselect";
import {
  Filters,
  FiltersEvents,
  PilotageTransformationStats,
  Scope,
  SelectedScope,
} from "../types";

const Loader = () => (
  <Box height={48}>
    <Skeleton
      opacity="0.3"
      width="100%"
      height={"100%"}
      py={4}
      px={8}
    ></Skeleton>
  </Box>
);

const generateEventFromScope = (
  scope: Scope
): "codeRegion" | "codeDepartement" | "codeAcademie" => {
  switch (scope) {
    case "departements":
      return "codeDepartement";
    case "academies":
      return "codeAcademie";
    case "regions":
    default:
      return "codeRegion";
  }
};

export const FiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  isLoading,
  data,
  scope,
}: {
  activeFilters: Partial<Filters>;
  handleFilters: (filter: Partial<Filters>) => void;
  filterTracker: (filterName: FiltersEvents) => () => void;
  isLoading: boolean;
  data?: PilotageTransformationStats;
  scope: SelectedScope;
}) => {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box borderRadius={4}>
      <SimpleGrid columns={[1, null, 4]} py={3} spacing={8}>
        <Box flex={[1, null, "unset"]}>
          <FormLabel>Granularité</FormLabel>
          <Select
            width={["100%", null, "100%"]}
            size="md"
            variant="newInput"
            value={scope.type}
            onChange={(e) => {
              filterTracker(generateEventFromScope(e.target.value as Scope));
              handleFilters({
                scope: e.target.value as Scope,
                code: undefined,
              });
            }}
          >
            <option key={"regions"} value={"regions"}>
              Régions
            </option>
            <option key={"academies"} value={"academies"}>
              Academies
            </option>
            <option key={"departements"} value={"departements"}>
              Departements
            </option>
          </Select>
        </Box>

        <Box display={["none", null, "block"]}>
          <FormLabel>Région</FormLabel>
          <Select
            width={"100%"}
            size="md"
            variant="newInput"
            value={
              scope.type === "regions" && scope?.value ? scope.value ?? "" : ""
            }
            borderBottomColor={scope.type === "regions" ? "info.525" : ""}
            onChange={(e) => {
              filterTracker("codeRegion");
              handleFilters({ scope: "regions", code: e.target.value });
            }}
            placeholder="Choisir une région"
          >
            {data?.filters?.regions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>

        <Box display={["none", null, "block"]}>
          <FormLabel>Académie</FormLabel>
          <Select
            width={"100%"}
            size="md"
            variant="newInput"
            value={
              scope.type === "academies" && scope?.value
                ? scope.value ?? ""
                : ""
            }
            borderBottomColor={scope.type === "academies" ? "info.525" : ""}
            onChange={(e) => {
              filterTracker("codeAcademie");
              handleFilters({ scope: "academies", code: e.target.value });
            }}
            placeholder="Choisir une académie"
          >
            {data?.filters?.academies?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>

        <Box display={["none", null, "block"]}>
          <FormLabel>Département</FormLabel>
          <Select
            width={"100%"}
            size="md"
            variant="newInput"
            value={
              scope.type === "departements" && scope?.value ? scope.value : ""
            }
            borderBottomColor={scope.type === "academies" ? "info.525" : ""}
            onChange={(e) => {
              filterTracker("codeDepartement");
              handleFilters({
                scope: "departements",
                code: e.target.value,
              });
            }}
            placeholder="Choisir un département"
          >
            {data?.filters?.departements?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={[1, null, 4]} py={3} spacing={8}>
        <Box flex={[1, null, "unset"]}>
          <FormLabel>Rentrée scolaire</FormLabel>
          <Select width={"100%"} size="md" variant="newInput">
            <option>2024</option>
            <option disabled>2025</option>
            <option disabled>2026</option>
            <option disabled>2027</option>
          </Select>
        </Box>
        <Box display={["none", null, "block"]}>
          <FormLabel>Diplôme</FormLabel>
          <Multiselect
            onClose={filterTracker("codeNiveauDiplome")}
            width={"100%"}
            size="md"
            variant={"newInput"}
            onChange={(selected) =>
              handleFilters({ codeNiveauDiplome: selected })
            }
            options={data?.filters?.diplomes ?? []}
            value={activeFilters.codeNiveauDiplome ?? []}
            disabled={!data?.filters?.diplomes?.length}
          >
            TOUS ({data?.filters?.diplomes?.length ?? 0})
          </Multiselect>
        </Box>
        <Box display={["none", null, "block"]}>
          <FormLabel>CPC</FormLabel>
          <Multiselect
            onClose={filterTracker("CPC")}
            width={"100%"}
            size="md"
            variant={"newInput"}
            onChange={(selected) => handleFilters({ CPC: selected })}
            options={data?.filters?.CPCs}
            value={activeFilters.CPC ?? []}
            disabled={!data?.filters?.CPCs?.length}
            hasDefaultValue={false}
          >
            TOUS ({data?.filters?.CPCs?.length ?? 0})
          </Multiselect>
        </Box>
        <Box display={["none", null, "block"]}>
          <FormLabel>Secteur d'activité</FormLabel>
          <Multiselect
            onClose={filterTracker("filiere")}
            width={"100%"}
            size="md"
            variant={"newInput"}
            onChange={(selected) => handleFilters({ filiere: selected })}
            options={data?.filters?.filieres ?? []}
            value={activeFilters.filiere ?? []}
            disabled={!data?.filters?.filieres?.length}
            hasDefaultValue={false}
          >
            TOUS ({data?.filters?.filieres?.length ?? 0})
          </Multiselect>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
