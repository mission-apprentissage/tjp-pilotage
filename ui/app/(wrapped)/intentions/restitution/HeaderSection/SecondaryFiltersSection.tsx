import { Box, Flex, FormLabel, Select } from "@chakra-ui/react";

import { Multiselect } from "../../../../../components/Multiselect";
import { getMotifLabel, MotifLabel } from "../../../utils/motifDemandeUtils";
import {
  getTypeDemandeLabel,
  TypeDemande,
} from "../../../utils/typeDemandeUtils";
import { Filters, StatsIntentions } from "../types";

export const SecondaryFiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  data,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
  data?: StatsIntentions;
}) => {
  const handleMotifLabelFilter = (motifLabel: MotifLabel) => {
    if (motifLabel === "autre") return "Autre";
    return getMotifLabel(motifLabel as MotifLabel);
  };
  return (
    <Box borderRadius={4} mb={8} display={["none", null, "block"]}>
      <Flex justifyContent={"start"} flexDirection={"column"} gap={4} py={3}>
        <Flex justifyContent={"start"} gap={4}>
          <Box justifyContent={"start"}>
            <FormLabel>Commune</FormLabel>
            <Multiselect
              onClose={filterTracker("commune")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("commune", selected)}
              options={data?.filters.communes}
              value={activeFilters.commune ?? []}
              disabled={data?.filters.communes.length === 0}
            >
              TOUTES ({data?.filters.communes.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Établissement</FormLabel>
            <Multiselect
              onClose={filterTracker("uai")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("uai", selected)}
              options={data?.filters.etablissements}
              value={activeFilters.uai ?? []}
              disabled={data?.filters.etablissements.length === 0}
            >
              TOUS ({data?.filters.etablissements.length ?? 0})
            </Multiselect>
          </Box>
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
            <FormLabel>Domaine de formation (NSF)</FormLabel>
            <Multiselect
              onClose={filterTracker("codeNsf")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("codeNsf", selected)}
              options={data?.filters.libellesNsf}
              value={activeFilters.codeNsf ?? []}
              disabled={data?.filters.libellesNsf.length === 0}
              hasDefaultValue={false}
            >
              TOUS ({data?.filters.libellesNsf.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>CPC</FormLabel>
            <Multiselect
              onClose={filterTracker("CPC")}
              width={"48"}
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
              hasDefaultValue={false}
            >
              TOUS ({data?.filters.familles.length ?? 0})
            </Multiselect>
          </Box>
        </Flex>
        <Flex justifyContent={"start"} gap={4}>
          <Box justifyContent={"start"}>
            <FormLabel>Statut</FormLabel>
            <Multiselect
              onClose={filterTracker("status")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("status", selected)}
              options={data?.filters.statuts}
              value={activeFilters.status ?? []}
              disabled={data?.filters.statuts.length === 0}
              hasDefaultValue={false}
            >
              TOUS ({data?.filters.statuts.length ?? 0})
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
            <FormLabel>Coloration</FormLabel>
            <Select
              width={"48"}
              size="md"
              variant={"newInput"}
              value={activeFilters.coloration?.toString() ?? ""}
              onChange={(e) => handleFilters("coloration", e.target.value)}
              borderBottomColor={
                activeFilters.coloration != undefined ? "info.525" : ""
              }
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
              width={"48"}
              size="md"
              variant={"newInput"}
              value={activeFilters.amiCMA?.toString() ?? ""}
              onChange={(e) => handleFilters("amiCMA", e.target.value)}
              borderBottomColor={
                activeFilters.amiCMA != undefined ? "info.525" : ""
              }
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
              borderBottomColor={
                activeFilters.secteur != undefined ? "info.525" : ""
              }
              placeholder="Public / privé"
            >
              {data?.filters.secteurs?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Voie</FormLabel>
            <Select
              width={"48"}
              size="md"
              variant={"newInput"}
              value={activeFilters.voie ?? ""}
              onChange={(e) => handleFilters("voie", e.target.value)}
              borderBottomColor={
                activeFilters.voie != undefined ? "info.525" : ""
              }
              placeholder="TOUTES"
            >
              {data?.filters.voie?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
