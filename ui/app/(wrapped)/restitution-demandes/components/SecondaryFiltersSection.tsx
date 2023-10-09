import { Box, Flex, FormLabel, Select } from "@chakra-ui/react";

import { Multiselect } from "../../../../components/Multiselect";
import { getMotifLabel, MotifLabel } from "../../utils/motifDemandeUtils";
import { getTypeDemandeLabel, TypeDemande } from "../../utils/typeDemandeUtils";
import { Filters, StatsDemandes } from "../types";

export const SecondaryFiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  data,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
  data?: StatsDemandes;
}) => {
  const handleMotifLabelFilter = (motifLabel: MotifLabel) => {
    if (motifLabel === "autre") return "Autre";
    return getMotifLabel(motifLabel as MotifLabel);
  };
  return (
    <Box borderRadius={4} mb={8}>
      <Flex justifyContent={"start"} flexDirection={"column"} gap={4} py={3}>
        <Flex justifyContent={"start"} gap={4}>
          <Box justifyContent={"start"}>
            <FormLabel>Formation</FormLabel>
            <Multiselect
              onClose={filterTracker("cfd")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("cfd", selected)}
              options={data?.filters.formations}
              value={activeFilters.cfd ?? []}
              disabled={data?.filters.formations.length === 0}
            >
              TOUTES ({data?.filters.formations.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Dispositif</FormLabel>
            <Multiselect
              onClose={filterTracker("dispositif")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("dispositif", selected)}
              options={data?.filters.dispositifs}
              value={activeFilters.dispositif ?? []}
              disabled={data?.filters.dispositifs.length === 0}
            >
              TOUS ({data?.filters.dispositifs.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Motif(s)</FormLabel>
            <Multiselect
              onClose={filterTracker("motif")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("motif", selected)}
              options={data?.filters.motifs.map(
                (motif: { value: string; label: string }) => {
                  return {
                    value: motif.value,
                    label: handleMotifLabelFilter(motif.value as MotifLabel),
                  };
                }
              )}
              value={activeFilters.motif ?? []}
              disabled={data?.filters.motifs.length === 0}
            >
              TOUS ({data?.filters.motifs.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>AMI/CMA</FormLabel>
            <Select
              width={"48"}
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
              width={"48"}
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
        <Flex justifyContent={"start"} gap={4}>
          <Box justifyContent={"start"}>
            <FormLabel>Diplôme</FormLabel>
            <Multiselect
              onClose={filterTracker("codeNiveauDiplome")}
              width={"48"}
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
            <FormLabel>Type de demande</FormLabel>
            <Multiselect
              onClose={filterTracker("typeDemande")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("typeDemande", selected)}
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
              disabled={data?.filters.typesDemande.length === 0}
            >
              TOUS ({data?.filters.typesDemande.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Coloration</FormLabel>
            <Select
              width={"48"}
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
            <FormLabel>Secteur d'activité</FormLabel>
            <Multiselect
              onClose={filterTracker("filiere")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("filiere", selected)}
              options={data?.filters.filieres}
              value={activeFilters.filiere ?? []}
              disabled={data?.filters.filieres.length === 0}
            >
              TOUS ({data?.filters.filieres.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Famille</FormLabel>
            <Multiselect
              onClose={filterTracker("cfdFamille")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("cfdFamille", selected)}
              options={data?.filters.familles}
              value={activeFilters.cfdFamille ?? []}
              disabled={data?.filters.familles.length === 0}
            >
              TOUS ({data?.filters.familles.length ?? 0})
            </Multiselect>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
