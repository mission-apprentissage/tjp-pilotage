import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import type { OptionSchema } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import { DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/saisie/DEMANDES_COLUMNS";
import type { Campagnes, Filters } from "@/app/(wrapped)/intentions/saisie/types";
import { isSaisieDisabled } from "@/app/(wrapped)/intentions/saisie/utils/isSaisieDisabled";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { Multiselect } from "@/components/Multiselect";
import { SearchInput } from "@/components/SearchInput";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";

const EXPORT_LIMIT = 1_000_000;

export const Header = ({
  activeFilters,
  searchParams,
  setSearchParams,
  getDemandesQueryParameters,
  searchDemande,
  setSearchDemande,
  campagnes,
  campagne,
  diplomes,
  academies,
  filterTracker,
  handleFilters,
}: {
  activeFilters: Filters;
  searchParams: {
    search?: string;
    campagne?: string;
  };
  setSearchParams: (params: { search?: string; campagne?: string }) => void;
  getDemandesQueryParameters: (qLimit: number, qOffset?: number) => Partial<Filters>;
  searchDemande?: string;
  setSearchDemande: (search: string) => void;
  campagnes?: Campagnes;
  campagne?: {
    annee: string;
    statut: string;
  };
  filterTracker: (filterName: keyof Filters) => () => void;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  diplomes: OptionSchema[];
  academies: OptionSchema[];
}) => {
  const trackEvent = usePlausible();
  const anneeCampagne = searchParams.campagne ?? campagne?.annee;

  const onClickSearchDemande = () => {
    setSearchParams({ search: searchDemande });
  };
  return (
    <Flex gap={2} mb={2}>
      <Flex direction={"column"} gap={1} flex={1}>
        {isSaisieDisabled() && (
          <Flex
            borderLeftWidth={5}
            borderLeftColor={"bluefrance.113"}
            bgColor={"grey.975"}
            direction={"column"}
            gap={2}
            padding={5}
            mb={8}
          >
            <Text fontWeight={700}>Campagne de saisie 2023 terminée</Text>
            <Text fontWeight={400}>
              La campagne de saisie 2023 est terminée, vous pourrez saisir vos demandes pour la campagne de saisie 2024
              d'ici le 15 avril.
            </Text>
          </Flex>
        )}
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
                  <Flex direction="row">
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
                          ...searchParams,
                          campagne: campagne.annee,
                        });
                      }}
                    >
                      <Flex direction="row">
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

            <ExportMenuButton
              onExportCsv={async () => {
                trackEvent("saisie_demandes:export");
                const data = await client.ref("[GET]/demandes").query({
                  query: getDemandesQueryParameters(EXPORT_LIMIT),
                });
                downloadCsv(
                  formatExportFilename("recueil_demandes", activeFilters.codeAcademie),
                  data.demandes,
                  DEMANDES_COLUMNS
                );
              }}
              onExportExcel={async () => {
                trackEvent("saisie_demandes:export-excel");
                const data = await client.ref("[GET]/demandes").query({
                  query: getDemandesQueryParameters(EXPORT_LIMIT),
                });
                downloadExcel(
                  formatExportFilename("recueil_demandes", activeFilters.codeAcademie),
                  data.demandes,
                  DEMANDES_COLUMNS
                );
              }}
              variant="externalLink"
            />
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
