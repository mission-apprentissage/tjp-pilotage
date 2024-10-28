import { Box, Button, Flex, FormLabel, Select } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { Corrections, FiltersCorrections } from "@/app/(wrapped)/intentions/corrections/types";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { Multiselect } from "@/components/Multiselect";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";

export const SecondaryFiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  resetFilters,
  data,
}: {
  activeFilters: FiltersCorrections;
  handleFilters: (type: keyof FiltersCorrections, value: FiltersCorrections[keyof FiltersCorrections]) => void;
  filterTracker: (filterName: keyof FiltersCorrections) => () => void;
  resetFilters: () => void;
  data?: Corrections;
}) => {
  const { openGlossaire } = useGlossaireContext();
  return (
    <Box borderRadius={4} mb={8} display={["none", null, "block"]}>
      <Flex justifyContent={"start"} flexDirection={"column"} gap={4} py={3}>
        <Flex justifyContent={"start"} gap={4}>
          <Box justifyContent={"start"}>
            <FormLabel>
              Domaine de formation (NSF)
              <TooltipIcon
                ml="1"
                label="Cliquez pour plus d'infos."
                onClick={() => openGlossaire("domaine-de-formation-nsf")}
              />
            </FormLabel>
            <Multiselect
              onClose={filterTracker("codeNsf")}
              width={"64"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("codeNsf", selected)}
              options={data?.filters.libellesNsf}
              value={activeFilters.codeNsf ?? []}
              disabled={data?.filters.libellesNsf.length === 0}
            >
              TOUS ({data?.filters.libellesNsf.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Formation</FormLabel>
            <Multiselect
              onClose={filterTracker("cfd")}
              width={"64"}
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
            <FormLabel>Diplôme</FormLabel>
            <Multiselect
              onClose={filterTracker("codeNiveauDiplome")}
              width={"64"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
              options={data?.filters.diplomes}
              value={activeFilters.codeNiveauDiplome ?? []}
              disabled={data?.filters.diplomes.length === 0}
            >
              TOUS ({data?.filters.diplomes.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Département</FormLabel>
            <Multiselect
              onClose={filterTracker("codeDepartement")}
              width={"64"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("codeDepartement", selected)}
              options={data?.filters.departements.map((departement) => ({
                label: formatDepartementLibelleWithCodeDepartement({
                  libelleDepartement: departement.label,
                  codeDepartement: departement.value,
                }),
                value: departement.value,
              }))}
              value={activeFilters.codeDepartement ?? []}
              disabled={data?.filters.departements.length === 0}
            >
              TOUS ({data?.filters.departements.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Établissement</FormLabel>
            <Multiselect
              onClose={filterTracker("uai")}
              width={"64"}
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
            <FormLabel>Secteur</FormLabel>
            <Select
              width={"64"}
              size="md"
              variant={"newInput"}
              value={activeFilters.secteur ?? ""}
              onChange={(e) => handleFilters("secteur", e.target.value)}
              borderBottomColor={activeFilters.secteur != undefined ? "info.525" : ""}
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
            <FormLabel>Statut</FormLabel>
            <Multiselect
              onClose={filterTracker("statut")}
              width={"64"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("statut", selected)}
              options={data?.filters.statuts}
              value={activeFilters.statut ?? []}
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
              width={"64"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("typeDemande", selected)}
              options={data?.filters.typesDemande.map((typeDemande: { value: string; label: string }) => {
                return {
                  value: typeDemande.value,
                  label: getTypeDemandeLabel(typeDemande.value),
                };
              })}
              value={activeFilters.typeDemande ?? []}
              disabled={data?.filters.typesDemande.length === 0}
            >
              TOUS ({data?.filters.typesDemande.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Voie</FormLabel>
            <Select
              width={"64"}
              size="md"
              variant={"newInput"}
              value={activeFilters.voie ?? ""}
              onChange={(e) => handleFilters("voie", e.target.value)}
              borderBottomColor={activeFilters.voie != undefined ? "info.525" : ""}
              placeholder="TOUTES"
            >
              {data?.filters.voies?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Coloration</FormLabel>
            <Select
              width={"64"}
              size="md"
              variant={"newInput"}
              value={activeFilters.coloration?.toString() ?? ""}
              onChange={(e) => handleFilters("coloration", e.target.value)}
              borderBottomColor={activeFilters.coloration != undefined ? "info.525" : ""}
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
              width={"64"}
              size="md"
              variant={"newInput"}
              value={activeFilters.amiCMA?.toString() ?? ""}
              onChange={(e) => handleFilters("amiCMA", e.target.value)}
              borderBottomColor={activeFilters.amiCMA != undefined ? "info.525" : ""}
              placeholder="Oui / non"
            >
              {data?.filters.amiCMAs?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
          <Button
            variant="externalLink"
            border={"none"}
            leftIcon={<Icon icon={"ri:refresh-line"} />}
            mt={"auto"}
            onClick={() => resetFilters()}
          >
            Réinitialiser les filtres
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
