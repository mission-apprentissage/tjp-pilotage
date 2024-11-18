import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Highlight,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type {
  DemandesRestitutionIntentions,
  FiltersDemandesRestitutionIntentions,
} from "@/app/(wrapped)/intentions/restitution/types";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { Multiselect } from "@/components/Multiselect";
import { TooltipIcon } from "@/components/TooltipIcon";
import { feature } from "@/utils/feature";
import { formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";

export const SecondaryFiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  resetFilters,
  data,
}: {
  activeFilters: FiltersDemandesRestitutionIntentions;
  handleFilters: (
    type: keyof FiltersDemandesRestitutionIntentions,
    value: FiltersDemandesRestitutionIntentions[keyof FiltersDemandesRestitutionIntentions]
  ) => void;
  filterTracker: (filterName: keyof FiltersDemandesRestitutionIntentions) => () => void;
  resetFilters: () => void;
  data?: DemandesRestitutionIntentions;
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
              hasDefaultValue={false}
            >
              Tous ({data?.filters.libellesNsf.length ?? 0})
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
              Toutes ({data?.filters.formations.length ?? 0})
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
              Tous ({data?.filters.diplomes.length ?? 0})
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
              options={data?.filters.departements.map(
                // @ts-expect-error TODO
                (departement) => ({
                  label: formatDepartementLibelleWithCodeDepartement({
                    libelleDepartement: departement.label,
                    codeDepartement: departement.value,
                  }),
                  value: departement.value,
                })
              )}
              value={activeFilters.codeDepartement ?? []}
              disabled={data?.filters.departements.length === 0}
            >
              Tous ({data?.filters.departements.length ?? 0})
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
              Tous ({data?.filters.etablissements.length ?? 0})
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
              {data?.filters.secteurs?.map(
                // @ts-expect-error TODO
                (option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
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
              Tous ({data?.filters.statuts.length ?? 0})
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
              Tous ({data?.filters.typesDemande.length ?? 0})
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
              placeholder="Toutes"
            >
              {data?.filters.voies?.map(
                // @ts-expect-error TODO
                (option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
            </Select>
          </Box>
          {feature.showColorationFilter && (
            <Box justifyContent={"start"}>
              <FormLabel>Coloration</FormLabel>
              <Menu gutter={6} matchWidth={false} autoSelect={true}>
                <MenuButton
                  as={Button}
                  variant={"selectButton"}
                  rightIcon={<ChevronDownIcon />}
                  width={[null, null, "64"]}
                  size="md"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="grey.900"
                  bg={"white"}
                >
                  <Flex direction="row">
                    <Text my={"auto"} textOverflow={"ellipsis"} overflow={"hidden"}>
                      <Highlight
                        query={["Toutes demandes", "ouvertures/fermetures", "demandes avec places colorées"]}
                        styles={{ fontWeight: "bold" }}
                      >
                        {data?.filters.colorations?.find(
                          // @ts-expect-error TODO
                          (c) => c.value === activeFilters.coloration
                        )?.label ?? "Toutes demandes"}
                      </Highlight>
                    </Text>
                  </Flex>
                </MenuButton>
                <MenuList py={0} borderRadius={4}>
                  {data?.filters.colorations?.map(
                    // @ts-expect-error TODO
                    (option) => (
                      <MenuItem
                        p={2}
                        key={option.value}
                        onClick={() => handleFilters("coloration", option.value)}
                        borderRadius={4}
                      >
                        <Flex direction="row">
                          <Text my={"auto"}>
                            <Highlight
                              query={["Toutes demandes", "ouvertures/fermetures", "demandes avec places colorées"]}
                              styles={{ fontWeight: "bold" }}
                            >
                              {option.label}
                            </Highlight>
                          </Text>
                        </Flex>
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </Menu>
            </Box>
          )}
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
              {data?.filters.amiCMAs?.map(
                // @ts-expect-error TODO
                (option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
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
              placeholder="Avec / sans"
            >
              {/* @ts-expect-error TODO */}
              {data?.filters.colorations?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>
          <Box justifyContent={"start"}>
            <FormLabel>Position quadrant</FormLabel>
            <Select
              width={"64"}
              size="md"
              variant={"newInput"}
              value={activeFilters.positionQuadrant?.toString() ?? ""}
              onChange={(e) => handleFilters("positionQuadrant", e.target.value)}
              borderBottomColor={activeFilters.positionQuadrant != undefined ? "info.525" : ""}
              placeholder="Toutes"
            >
              {[
                {
                  value: PositionQuadrantEnum.Q1,
                  label: PositionQuadrantEnum.Q1,
                },
                {
                  value: PositionQuadrantEnum.Q2,
                  label: PositionQuadrantEnum.Q2,
                },
                {
                  value: PositionQuadrantEnum.Q3,
                  label: PositionQuadrantEnum.Q3,
                },
                {
                  value: PositionQuadrantEnum.Q4,
                  label: PositionQuadrantEnum.Q4,
                },
                {
                  value: PositionQuadrantEnum["Hors quadrant"],
                  label: PositionQuadrantEnum["Hors quadrant"],
                },
              ].map((option) => (
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
