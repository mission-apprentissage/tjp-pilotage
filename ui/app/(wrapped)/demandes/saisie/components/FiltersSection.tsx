import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { OptionType } from "shared/schema/optionSchema";

import type { ISearchParams} from "@/app/(wrapped)/demandes/saisie/page.client";
import type { Filters } from "@/app/(wrapped)/demandes/saisie/types";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";
import { feature } from "@/utils/feature";

export const FiltersSection = ({
  setSearchParams,
  campagne,
  activeFilters,
  filterTracker,
  handleFilters,
  diplomes,
  academies,
  campagnes,
}: {
  setSearchParams: (params: ISearchParams) => void;
  campagne: CampagneType;
  activeFilters: Filters;
  filterTracker: (filterName: keyof Filters) => () => void;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  diplomes: OptionType[];
  academies: OptionType[];
  campagnes?: CampagneType[];
}) => {
  const anneeCampagne = activeFilters.campagne ?? campagne?.annee;

  return (
    <Flex direction={"column"} gap={2} bgColor={"white"} p={4} boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" wrap={"wrap"} >
      <Flex gap={2}>
        <Flex direction={"column"} gap={1}>
          <Menu gutter={0} matchWidth={true} autoSelect={false}>
            <MenuButton
              as={Button}
              variant={"selectButton"}
              rightIcon={<ChevronDownIcon />}
              w={"100%"}
              borderWidth="1px"
              borderStyle="solid"
              borderColor="grey.900"
            >
              <Flex direction="row" gap={2}>
                <Text my={"auto"}>Campagne {campagnes?.find((c) => c.annee === anneeCampagne)?.annee ?? ""}</Text>
                <CampagneStatutTag statut={campagnes?.find((c) => c.annee === anneeCampagne)?.statut} />
              </Flex>
            </MenuButton>
            <MenuList py={0} borderTopRadius={0} zIndex={"dropdown"}>
              {campagnes?.map((campagne) => (
                <MenuItem
                  p={2}
                  key={campagne.annee}
                  onClick={() => {
                    setSearchParams({
                      filters: { ...activeFilters, campagne: campagne.annee },
                    });
                  }}
                >
                  <Flex direction="row" gap={2}>
                    <Text my={"auto"}>Campagne {campagne.annee}</Text>
                    <CampagneStatutTag statut={campagne.statut} />
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
        {feature.saisieDisabled && (
          <Flex
            borderLeftWidth={5}
            borderLeftColor={"bluefrance.113"}
            bgColor={"grey.975"}
            direction={"column"}
            gap={2}
            padding={5}
            mb={8}
          >
            <Text fontWeight={700}>Campagne de saisie terminée</Text>
            <Text fontWeight={400}>
            La campagne de saisie est terminée, vous pourrez saisir vos demandes pour la prochaine campagne de saisie
            d"ici le 15 avril.
            </Text>
          </Flex>
        )}
        <Flex flexDirection={["column", null, "row"]} justifyContent={"space-between"} gap={2} flex={1}>
          <Flex direction={"row"} gap={2} flex={1}>
            <Box justifyContent={"start"}>
              <Multiselect
                onClose={filterTracker("codeAcademie")}
                width={"64"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("codeAcademie", selected)}
                options={academies}
                value={activeFilters.codeAcademie ?? []}
                disabled={academies.length === 0}
                hasDefaultValue={false}
              >
              Académie: Toutes ({academies.length ?? 0})
              </Multiselect>
            </Box>
            <Box justifyContent={"start"}>
              <Multiselect
                onClose={filterTracker("codeNiveauDiplome")}
                width={"64"}
                size="md"
                variant={"newInput"}
                onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
                options={diplomes}
                value={activeFilters.codeNiveauDiplome ?? []}
                disabled={diplomes.length === 0}
                hasDefaultValue={false}
              >
              Diplôme: Tous ({diplomes.length ?? 0})
              </Multiselect>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
