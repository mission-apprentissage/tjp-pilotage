import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from "@chakra-ui/react";
import {useQueryClient} from '@tanstack/react-query';
import { usePlausible } from "next-plausible";
import { useState } from "react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { OptionType } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import { StatutTag } from "@/app/(wrapped)/intentions/perdir/components/StatutTag";
import { INTENTIONS_COLUMNS } from "@/app/(wrapped)/intentions/perdir/saisie/INTENTIONS_COLUMNS";
import type { Filters } from "@/app/(wrapped)/intentions/perdir/saisie/types";
import { getOrderStatut, getStepWorkflow} from '@/app/(wrapped)/intentions/utils/statutUtils';
import { AdvancedExportMenuButton } from "@/components/AdvancedExportMenuButton";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";
import { SearchInput } from "@/components/SearchInput";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { feature } from "@/utils/feature";
import { formatExportFilename } from "@/utils/formatExportFilename";

export const Header = ({
  activeFilters,
  filterTracker,
  setSearchParams,
  getIntentionsQueryParameters,
  searchIntention,
  setSearchIntention,
  campagne,
  handleFilters,
  diplomes,
  academies,
  campagnes,
  checkedIntentions,
  setCheckedIntentions,
  setIsModifyingGroup,
}: {
  activeFilters: Filters;
  filterTracker: (filterName: keyof Filters) => () => void;
  setSearchParams: (params: { filters: Partial<Filters> }) => void;
  getIntentionsQueryParameters: (qLimit?: number, qOffset?: number) => Partial<Filters>;
  searchIntention?: string;
  setSearchIntention: (search: string) => void;
  campagne?: {
    annee: string;
    statut: string;
  };
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  diplomes: OptionType[];
  academies: OptionType[];
  campagnes?: CampagneType[];
  checkedIntentions: Record<string, { statut: DemandeStatutType }>;
  setCheckedIntentions: (checkedIntentions: Record<string, { statut: DemandeStatutType }>) => void;
  setIsModifyingGroup: (isModifyingGroup: boolean) => void;
}) => {
  const toast = useToast();
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

  const statutsPossiblesActionsGroupees = Object.keys(DemandeStatutEnum).filter((statut) =>
    Object.values(checkedIntentions).every((demande) => {
      const seuilActuel = getStepWorkflow(demande.statut);
      const seuilMax = seuilActuel + 1;
      const seuilCible = getStepWorkflow(statut as DemandeStatutType);

      return demande.statut !== statut &&
        getOrderStatut(demande.statut) <= getOrderStatut(statut as DemandeStatutType) &&
        seuilCible >= seuilActuel &&
        seuilCible <= seuilMax;
    })
  );

  const queryClient = useQueryClient();

  const {
    mutate: submitIntentionsStatut,
    isLoading,
  } = client.ref("[POST]/intentions/statut/submit").useMutation({
    onMutate: () => {
      setIsModifyingGroup(true);
    },
    onError: (error) => {
      toast({
        variant: "left-accent",
        status: "error",
        title: "Une erreur est survenue lors de la modification des intentions",
        description: error.message,
      });
      setIsModifyingGroup(false);
    },
    onSuccess: async () => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "Les intentions ont été modifiées avec succès",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/intentions"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/intentions/count"],
        });
        setCheckedIntentions({});
        setStatut(undefined);
        setIsModifyingGroup(false);
      }, 500);
    },
  });

  const [statut, setStatut] = useState<DemandeStatutType | undefined>();

  return (
    <Flex direction={"column"} gap={2} mb={2}>
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
      <Collapse in={Object.keys(checkedIntentions).length > 0}>
        <Flex direction={"row"} gap={4} bgColor={"bluefrance.850"} p={4} justify={"space-between"} >
          <Flex my={"auto"}>
            <Text color={"bluefrance.113"} fontWeight={700} fontSize={16}>
              { Object.keys(checkedIntentions).length > 1 ?
                `${Object.keys(checkedIntentions).length} demandes sélectionnées` :
                `${Object.keys(checkedIntentions).length} demande sélectionnée`
              }
            </Text>
          </Flex>
          <Flex direction={"row"} gap={6}>
            <Menu gutter={0} matchWidth={true} autoSelect={false}>
              <MenuButton
                as={Button}
                variant={"selectButton"}
                rightIcon={<ChevronDownIcon />}
                w={"100%"}
                borderWidth="1px"
                borderStyle="solid"
                borderColor="grey.900"
                bgColor={"white"}
              >
                <Flex direction="row" gap={2}>
                  {
                    statut ?
                      (
                        <StatutTag statut={statut as DemandeStatutType} />
                      ) :
                      (
                        <Text>Changer le statut</Text>
                      )
                  }
                </Flex>
              </MenuButton>
              <MenuList py={0} borderTopRadius={0} zIndex={"banner"}>
                {statutsPossiblesActionsGroupees?.map((statut) => (
                  <MenuItem
                    p={2}
                    key={statut}
                    onClick={() => {
                      setStatut(statut as DemandeStatutType);
                    }}
                  >
                    <Flex direction="row" gap={2}>
                      <StatutTag statut={statut as DemandeStatutType} size="md" />
                    </Flex>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Button
              onClick={() => {
                if(statut) submitIntentionsStatut({
                  body: {
                    intentions: Object.keys(checkedIntentions).map((intention) => ({numero: intention})),
                    statut,
                  }
                });
              }}
              disabled={isLoading || !statut}
              variant={"secondary"}
              color={"bluefrance.113"}
              w={40}
            >
              Confirmer
            </Button>
          </Flex>
        </Flex>
      </Collapse>
    </Flex>
  );
};
