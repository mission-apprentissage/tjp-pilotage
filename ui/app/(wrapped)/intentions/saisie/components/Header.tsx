import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { OptionType } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import { DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/saisie/DEMANDES_COLUMNS";
import type { Filters } from "@/app/(wrapped)/intentions/saisie/types";
import { AdvancedExportMenuButton } from "@/components/AdvancedExportMenuButton";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";
import { SearchInput } from "@/components/SearchInput";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";

export const Header = ({
  activeFilters,
  setSearchParams,
  getDemandesQueryParameters,
  searchDemande,
  setSearchDemande,
  campagne,
  filterTracker,
  handleFilters,
  diplomes,
  academies,
  campagnes,
}: {
  activeFilters: Filters;
  setSearchParams: (params: { filters: Partial<Filters> }) => void;
  getDemandesQueryParameters: (qLimit?: number, qOffset?: number) => Partial<Filters>;
  searchDemande?: string;
  setSearchDemande: (search: string) => void;
  campagne?: {
    annee: string;
    statut: string;
  };
  filterTracker: (filterName: keyof Filters) => () => void;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  diplomes: OptionType[];
  academies: OptionType[];
  campagnes?: CampagneType[];
}) => {
  const trackEvent = usePlausible();
  const anneeCampagne = activeFilters.campagne ?? campagne?.annee;

  const onClickSearchDemande = () => {
    setSearchParams({ filters: { search: searchDemande } });
  };

  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("saisie_demandes:export");
    const data = await client.ref("[GET]/demandes").query({
      query: isFiltered ? getDemandesQueryParameters() : {},
    });
    downloadCsv(formatExportFilename("recueil_demandes"), data.demandes, DEMANDES_COLUMNS);
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("saisie_demandes:export-excel");
    const data = await client.ref("[GET]/demandes").query({
      query: isFiltered ? getDemandesQueryParameters() : {},
    });
    downloadExcel(formatExportFilename("recueil_demandes"), data.demandes, DEMANDES_COLUMNS);
  };
  return (
    <Flex gap={2} mb={2}>
      <Flex direction={"column"} gap={1} flex={1}>
        <Flex direction={"row"} flex={1} justifyContent={"space-between"}>
          <Flex direction={"row"} gap={2} flex={1}>
            <Flex direction={"column"}>
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
                <MenuList py={0} borderTopRadius={0} zIndex={"banner"}>
                  {campagnes?.map((campagne) => (
                    <MenuItem
                      p={2}
                      key={campagne.annee}
                      onClick={() => {
                        setSearchParams({
                          filters: {
                            ...activeFilters,
                            campagne: campagne.annee,
                          },
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

            <AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="externalLink" />
          </Flex>

          <SearchInput
            value={searchDemande}
            onChange={setSearchDemande}
            onClick={onClickSearchDemande}
            placeholder="55F47A1I, Jules Verne, Cybersécurité..."
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
