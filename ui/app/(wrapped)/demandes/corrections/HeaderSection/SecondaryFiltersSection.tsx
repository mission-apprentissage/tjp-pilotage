import { Box, Button, Flex, Select,Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import type { Corrections, FiltersCorrections } from "@/app/(wrapped)/demandes/corrections/types";
import { getTypeDemandeLabel } from "@/app/(wrapped)/demandes/utils/typeDemandeUtils";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { Multiselect } from "@/components/Multiselect";
import { TooltipIcon } from "@/components/TooltipIcon";
import {feature} from '@/utils/feature';
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
            <Text fontWeight={500} mb={1}>
              Domaine de formation (NSF)
              <TooltipIcon
                ml="1"
                label="Cliquez pour plus d'infos."
                onClick={() => openGlossaire("domaine-de-formation-nsf")}
              />
            </Text>
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
              Tous ({data?.filters.libellesNsf.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <Text fontWeight={500} mb={1}>Formation</Text>
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
            <Text fontWeight={500} mb={1}>Diplôme</Text>
            <Multiselect
              onClose={filterTracker("codeNiveauDiplome")}
              width={"48"}
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
            <Text fontWeight={500} mb={1}>Département</Text>
            <Multiselect
              onClose={filterTracker("codeDepartement")}
              width={"48"}
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
              Tous ({data?.filters.departements.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <Text fontWeight={500} mb={1}>Établissement</Text>
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
              Tous ({data?.filters.etablissements.length ?? 0})
            </Multiselect>
          </Box>
          <Box justifyContent={"start"}>
            <Text as="label" htmlFor="select-secteur" fontWeight={500} mb={1}>Secteur</Text>
            <Select
              id="select-secteur"
              width={"48"}
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
          <Box justifyContent={"start"}>
            <Text as="label" htmlFor="select-voie" fontWeight={500} mb={1}>Voie</Text>
            <Select
              id="select-voie"
              width={"48"}
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
        </Flex>
        <Flex justifyContent={"start"} gap={4}>
          <Box justifyContent={"start"}>
            <Text fontWeight={500} mb={1}>Statut</Text>
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
            <Text fontWeight={500} mb={1}>Type de demande</Text>
            <Multiselect
              onClose={filterTracker("typeDemande")}
              width={"48"}
              size="md"
              variant={"newInput"}
              onChange={(selected) => handleFilters("typeDemande", selected)}
              options={data?.filters.typesDemande.map((typeDemande) => {
                return {
                  value: typeDemande.value,
                  label: getTypeDemandeLabel(typeDemande.value as TypeDemandeType),
                };
              })}
              value={activeFilters.typeDemande ?? []}
              disabled={data?.filters.typesDemande.length === 0}
            >
              Tous ({data?.filters.typesDemande.length ?? 0})
            </Multiselect>
          </Box>
          {feature.showColorationFilter && (
            <Box justifyContent={"start"}>
              <Text as="label" htmlFor="select-coloration" fontWeight={500} mb={1}>Coloration</Text>
              <Select
                id="select-coloration"
                width={"48"}
                size="md"
                variant={"newInput"}
                value={activeFilters.coloration?.toString() ?? ""}
                onChange={(e) => handleFilters("coloration", e.target.value)}
                borderBottomColor={activeFilters.coloration != undefined ? "info.525" : ""}
                placeholder="Avec / sans"
              >
                {data?.filters.colorations?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
          )}
          <Box justifyContent={"start"}>
            <Text as="label" htmlFor="select-ami-cma" fontWeight={500} mb={1}>AMI/CMA</Text>
            <Select
              id="select-ami-cma"
              width={"48"}
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
          <Box justifyContent={"start"}>
            <Text as="label" htmlFor="select-position-quadrant" fontWeight={500} mb={1}>Position quadrant</Text>
            <Select
              id="select-position-quadrant"
              width={"48"}
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
          <Box justifyContent={"start"}>
            <Text fontWeight={500} mb={1}>Formations spécifiques</Text>
            <Multiselect
              width={"48"}
              size="md"
              variant="newInput"
              onChange={(selected) => handleFilters("formationSpecifique", selected)}
              options={[
                {
                  label: TypeFormationSpecifiqueEnum["Action prioritaire"],
                  value: TypeFormationSpecifiqueEnum["Action prioritaire"],
                },
                {
                  label: TypeFormationSpecifiqueEnum["Transition démographique"],
                  value: TypeFormationSpecifiqueEnum["Transition démographique"],
                },
                {
                  label: TypeFormationSpecifiqueEnum["Transition écologique"],
                  value: TypeFormationSpecifiqueEnum["Transition écologique"],
                },
                {
                  label: TypeFormationSpecifiqueEnum["Transition numérique"],
                  value: TypeFormationSpecifiqueEnum["Transition numérique"],
                },
              ]}
              hasDefaultValue={false}
              value={activeFilters.formationSpecifique ?? []}
              gutter={0}
            >
              Toutes
            </Multiselect>
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
