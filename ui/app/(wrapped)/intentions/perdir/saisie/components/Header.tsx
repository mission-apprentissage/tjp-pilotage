import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import type { OptionSchema } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import { INTENTIONS_COLUMNS } from "@/app/(wrapped)/intentions/perdir/saisie/INTENTIONS_COLUMNS";
import type { Campagnes, Filters } from "@/app/(wrapped)/intentions/perdir/saisie/types";
import { isSaisieDisabled } from "@/app/(wrapped)/intentions/perdir/saisie/utils/canEditIntention";
import { AdvancedExportMenuButton } from "@/components/AdvancedExportMenuButton";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";
import { SearchInput } from "@/components/SearchInput";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";

export const Header = ({
  activeFilters,
  filterTracker,
  setSearchParams,
  getIntentionsQueryParameters,
  searchIntention,
  setSearchIntention,
  campagnes,
  campagne,
  handleFilters,
  diplomes,
  academies,
}: {
  activeFilters: Filters;
  filterTracker: (filterName: keyof Filters) => () => void;
  setSearchParams: (params: { filters: Partial<Filters> }) => void;
  getIntentionsQueryParameters: (qLimit?: number, qOffset?: number) => Partial<Filters>;
  searchIntention?: string;
  setSearchIntention: (search: string) => void;
  campagnes?: Campagnes;
  campagne?: {
    annee: string;
    statut: string;
  };
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  diplomes: OptionSchema[];
  academies: OptionSchema[];
}) => {
  const trackEvent = usePlausible();
  const anneeCampagne = activeFilters.campagne ?? campagne?.annee;

  const onClickSearchIntention = () => {
    setSearchParams({ filters: { search: searchIntention } });
  };

  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("saisie_intentions_perdir:export");
    const data = await client.ref("[GET]/intentions").query({
      query: isFiltered ? getIntentionsQueryParameters() : {},
    });
    downloadCsv(
      formatExportFilename("recueil_demandes"),
      [
        ...data.intentions.map((intention) => ({
          ...intention,
          ...intention.avis.reduce(
            (acc, current, index) => {
              acc[`avis${index}`] = [
                current.fonction!.toUpperCase(),
                `Avis ${current.statut}`,
                current.commentaire,
              ].join(" - ");
              return acc;
            },
            {} as Record<string, string>
          ),
        })),
      ],
      INTENTIONS_COLUMNS
    );
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("saisie_intentions_perdir:export-excel");
    const data = await client.ref("[GET]/intentions").query({
      query: isFiltered ? getIntentionsQueryParameters() : {},
    });
    downloadExcel(
      formatExportFilename("recueil_demandes"),
      [
        ...data.intentions.map((intention) => ({
          ...intention,
          ...intention.avis.reduce(
            (acc, current, index) => {
              acc[`avis${index}`] = [
                current.fonction!.toUpperCase(),
                `Avis ${current.statut}`,
                current.commentaire,
              ].join(" - ");
              return acc;
            },
            {} as Record<string, string>
          ),
        })),
      ],
      INTENTIONS_COLUMNS
    );
  };

  return (
    <Flex gap={2} mb={2}>
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
          <AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="externalLink" />
        </Flex>

        <SearchInput
          value={searchIntention}
          onChange={setSearchIntention}
          onClick={onClickSearchIntention}
          placeholder="30745A1I, Jules Verne, Cybersécurité..."
        />
      </Flex>
    </Flex>
  );
};
