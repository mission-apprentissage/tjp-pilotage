import { Box, Flex, FormLabel, Select, Skeleton } from "@chakra-ui/react";

import { Multiselect } from "../../../../components/Multiselect";
import { getMotifLabel, MotifLabel } from "../../utils/motifDemandeUtils";
import { getTypeDemandeLabel, TypeDemande } from "../../utils/typeDemandeUtils";
import { Filters, StatsDemandes } from "../types";

export const SecondaryFiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  isLoading,
  data,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
  isLoading: boolean;
  data?: StatsDemandes;
}) => {
  return (
    <>
      {isLoading ? (
        <Box height={24}>
          <Skeleton
            opacity="0.3"
            width="100%"
            height={"100%"}
            py={4}
            px={8}
          ></Skeleton>
        </Box>
      ) : (
        <Box borderRadius={4} px={8} mb={8}>
          <Flex
            justifyContent={"start"}
            flexDirection={"column"}
            gap={8}
            py={3}
          >
            <Flex justifyContent={"start"} gap={8}>
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
                >
                  TOUS ({data?.filters.diplomes.length ?? 0})
                </Multiselect>
              </Box>
              <Box justifyContent={"start"}>
                <FormLabel>Formation</FormLabel>
                <Multiselect
                  onClose={filterTracker("cfd")}
                  width={"72"}
                  size="md"
                  variant={"newInput"}
                  onChange={(selected) => handleFilters("cfd", selected)}
                  options={data?.filters.formations}
                  value={activeFilters.cfd ?? []}
                >
                  TOUTES ({data?.filters.formations.length ?? 0})
                </Multiselect>
              </Box>
              <Box justifyContent={"start"}>
                <FormLabel>Dispositif</FormLabel>
                <Multiselect
                  onClose={filterTracker("dispositif")}
                  width={"72"}
                  size="md"
                  variant={"newInput"}
                  onChange={(selected) => handleFilters("dispositif", selected)}
                  options={data?.filters.dispositifs}
                  value={activeFilters.dispositif ?? []}
                >
                  TOUS ({data?.filters.dispositifs.length ?? 0})
                </Multiselect>
              </Box>
              <Box justifyContent={"start"}>
                <FormLabel>Type de demande</FormLabel>
                <Multiselect
                  onClose={filterTracker("typeDemande")}
                  width={"72"}
                  size="md"
                  variant={"newInput"}
                  onChange={(selected) =>
                    handleFilters("typeDemande", selected)
                  }
                  options={data?.filters.typesDemande.map(
                    (typeDemande: { value: string; label: string }) => {
                      return {
                        value: typeDemande.value,
                        label: getTypeDemandeLabel(
                          typeDemande.value as TypeDemande
                        ),
                      };
                    }
                  )}
                  value={activeFilters.typeDemande ?? []}
                >
                  TOUS ({data?.filters.typesDemande.length ?? 0})
                </Multiselect>
              </Box>
            </Flex>
            <Flex justifyContent={"start"} gap={8}>
              <Box justifyContent={"start"}>
                <FormLabel>Motif(s)</FormLabel>
                <Multiselect
                  onClose={filterTracker("motifDemande")}
                  width={"72"}
                  size="md"
                  variant={"newInput"}
                  onChange={(selected) =>
                    handleFilters("motifDemande", selected)
                  }
                  options={data?.filters.motifs.map(
                    (motif: { value: string; label: string }) => {
                      return {
                        value: motif.value,
                        label: getMotifLabel(motif.value as MotifLabel),
                      };
                    }
                  )}
                  value={activeFilters.motifDemande ?? []}
                >
                  TOUS ({data?.filters.motifs.length ?? 0})
                </Multiselect>
              </Box>
              <Box justifyContent={"start"}>
                <FormLabel>Coloration</FormLabel>
                <Select
                  width={"72"}
                  size="md"
                  variant={"newInput"}
                  value={activeFilters.coloration?.toString() ?? ""}
                  onChange={(e) => handleFilters("coloration", e.target.value)}
                  placeholder="Oui / non"
                >
                  {data?.filters.colorations?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box justifyContent={"start"}>
                <FormLabel>AMI/CMA</FormLabel>
                <Select
                  width={"72"}
                  size="md"
                  variant={"newInput"}
                  value={activeFilters.amiCMA?.toString() ?? ""}
                  onChange={(e) => handleFilters("amiCMA", e.target.value)}
                  placeholder="Oui / non"
                >
                  {data?.filters.amiCMAs?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box justifyContent={"start"}>
                <FormLabel>Secteur</FormLabel>
                <Select
                  width={"72"}
                  size="md"
                  variant={"newInput"}
                  value={activeFilters.secteur ?? ""}
                  onChange={(e) => handleFilters("secteur", e.target.value)}
                  placeholder="Public / privé"
                >
                  {data?.filters.secteurs?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  );
};
