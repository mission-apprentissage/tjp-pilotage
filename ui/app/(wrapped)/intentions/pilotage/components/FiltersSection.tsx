import { Box, FormLabel, Select, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { Scope, ScopeEnum } from "shared";

import { Multiselect } from "@/components/Multiselect";
import { TooltipIcon } from "@/components/TooltipIcon";

import { useGlossaireContext } from "../../../glossaire/glossaireContext";
import {
  FiltersEventsStatsPilotageIntentions,
  FiltersStatsPilotageIntentions,
  SelectedScope,
  StatsPilotageIntentions,
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
    case ScopeEnum.departement:
      return "codeDepartement";
    case ScopeEnum.academie:
      return "codeAcademie";
    case ScopeEnum.region:
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
  findDefaultRentreeScolaireForCampagne,
}: {
  activeFilters: Partial<FiltersStatsPilotageIntentions>;
  handleFilters: (filter: Partial<FiltersStatsPilotageIntentions>) => void;
  filterTracker: (
    filterName: FiltersEventsStatsPilotageIntentions
  ) => () => void;
  isLoading: boolean;
  data?: StatsPilotageIntentions;
  scope: SelectedScope;
  findDefaultRentreeScolaireForCampagne: (
    campagne: string
  ) => string | undefined;
}) => {
  const { openGlossaire } = useGlossaireContext();
  if (isLoading) {
    return <Loader />;
  }

  const isDefaultRentreeScolaire =
    activeFilters.rentreeScolaire?.length === 1 &&
    activeFilters.rentreeScolaire[0] ===
      findDefaultRentreeScolaireForCampagne(activeFilters.campagne || "");

  const onCampagneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    filterTracker("campagne");
    const rentreeScolaire = findDefaultRentreeScolaireForCampagne(
      e.target.value
    );

    if (rentreeScolaire !== undefined && isDefaultRentreeScolaire) {
      handleFilters({
        campagne: e.target.value,
        rentreeScolaire: [rentreeScolaire],
      });
    } else {
      handleFilters({ campagne: e.target.value });
    }
  };

  return (
    <Box borderRadius={4}>
      <SimpleGrid columns={[1, null, 4]} py={3} spacing={8}>
        <Box flex={[1, null, "unset"]}>
          <FormLabel>Campagne</FormLabel>
          <Select
            width={"100%"}
            size="md"
            variant="newInput"
            value={activeFilters.campagne ?? ""}
            borderBottomColor={
              scope.type === ScopeEnum.region ? "info.525" : ""
            }
            onChange={(e) => onCampagneChange(e)}
            placeholder="Choisir une campagne"
          >
            {data?.filters?.campagnes?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>
      </SimpleGrid>
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
            <option key={ScopeEnum.region} value={ScopeEnum.region}>
              Régions
            </option>
            <option key={ScopeEnum.academie} value={ScopeEnum.academie}>
              Académies
            </option>
            <option key={ScopeEnum.departement} value={ScopeEnum.departement}>
              Départements
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
              scope.type === ScopeEnum.region && scope?.value
                ? scope.value ?? ""
                : ""
            }
            borderBottomColor={
              scope.type === ScopeEnum.region ? "info.525" : ""
            }
            onChange={(e) => {
              filterTracker("codeRegion");
              handleFilters({ scope: ScopeEnum.region, code: e.target.value });
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
              scope.type === ScopeEnum.academie && scope?.value
                ? scope.value ?? ""
                : ""
            }
            borderBottomColor={
              scope.type === ScopeEnum.academie ? "info.525" : ""
            }
            onChange={(e) => {
              filterTracker("codeAcademie");
              handleFilters({
                scope: ScopeEnum.academie,
                code: e.target.value,
              });
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
              scope.type === ScopeEnum.departement && scope?.value
                ? scope.value
                : ""
            }
            borderBottomColor={
              scope.type === ScopeEnum.departement ? "info.525" : ""
            }
            onChange={(e) => {
              filterTracker("codeDepartement");
              handleFilters({
                scope: ScopeEnum.departement,
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
          <Multiselect
            onClose={filterTracker("rentreeScolaire")}
            width={"100%"}
            size="md"
            variant={"newInput"}
            onChange={(selected) =>
              handleFilters({ rentreeScolaire: selected })
            }
            options={data?.filters?.rentreesScolaires ?? []}
            value={activeFilters.rentreeScolaire ?? []}
            disabled={!data?.filters?.rentreesScolaires?.length}
          >
            TOUS ({data?.filters?.rentreesScolaires?.length ?? 0})
          </Multiselect>
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
          <FormLabel>
            Domaine de formation (NSF)
            <TooltipIcon
              ml="1"
              label="cliquez pour plus d'infos."
              onClick={() => openGlossaire("domaine-de-formation-nsf")}
            />
          </FormLabel>
          <Multiselect
            onClose={filterTracker("codeNsf")}
            width={"100%"}
            size="md"
            variant={"newInput"}
            onChange={(selected) => handleFilters({ codeNsf: selected })}
            options={data?.filters?.libellesNsf ?? []}
            value={activeFilters.codeNsf ?? []}
            disabled={!data?.filters?.libellesNsf?.length}
            hasDefaultValue={false}
          >
            TOUS ({data?.filters?.libellesNsf?.length ?? 0})
          </Multiselect>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
