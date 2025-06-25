import {ArrowForwardIcon,ChevronDownIcon} from "@chakra-ui/icons";
import { Box, Button, Collapse, Flex, Highlight, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { usePlausible } from "next-plausible";
import { useState } from "react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { OptionType } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import { StatutTag } from "@/app/(wrapped)/demandes/components/StatutTag";
import { DEMANDES_COLUMNS } from "@/app/(wrapped)/demandes/saisie/DEMANDES_COLUMNS";
import type { CheckedDemandesType, ISearchParams} from "@/app/(wrapped)/demandes/saisie/page.client";
import type { Filters } from "@/app/(wrapped)/demandes/saisie/types";
import { formatStatut, getPossibleNextStatuts } from "@/app/(wrapped)/demandes/utils/statutUtils";
import { AdvancedExportMenuButton } from "@/components/AdvancedExportMenuButton";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";
import { SearchInput } from "@/components/SearchInput";
import type {DetailedApiError} from "@/utils/apiError";
import { getDetailedErrorMessage } from "@/utils/apiError";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { feature } from "@/utils/feature";
import { formatExportFilename } from "@/utils/formatExportFilename";
import { useAuth } from "@/utils/security/useAuth";

export const Header = ({
  searchParams,
  setSearchParams,
  getDemandesQueryParameters,
  searchDemande,
  setSearchDemande,
  campagne,
  activeFilters,
  filterTracker,
  handleFilters,
  diplomes,
  academies,
  campagnes,
  checkedDemandes,
  setCheckedDemandes,
  setIsModifyingGroup,
}: {
  searchParams: ISearchParams;
  setSearchParams: (params: ISearchParams) => void;
  getDemandesQueryParameters: (qLimit?: number, qOffset?: number) => Partial<Filters>;
  searchDemande?: string;
  setSearchDemande: (search: string) => void;
  campagne?: {
    annee: string;
    statut: string;
  };
  activeFilters: Filters;
  filterTracker: (filterName: keyof Filters) => () => void;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  diplomes: OptionType[];
  academies: OptionType[];
  campagnes?: CampagneType[];
  checkedDemandes: CheckedDemandesType | undefined;
  setCheckedDemandes: (checkedDemandes: CheckedDemandesType | undefined) => void;
  setIsModifyingGroup: (isModifyingGroup: boolean) => void;
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const trackEvent = usePlausible();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anneeCampagne = activeFilters.campagne ?? campagne?.annee;

  const onClickSearchDemande = () => {
    setSearchParams({
      ...searchParams,
      filters: {
        ...searchParams.filters,
        search: searchDemande,
      },
    });
  };

  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("saisie_demandes:export");
    const data = await client.ref("[GET]/demandes").query({
      query: isFiltered ? getDemandesQueryParameters() : {},
    });
    downloadCsv(
      formatExportFilename("recueil_demandes"),
      [
        ...data.demandes.map((demande) => ({
          ...demande,
          ...demande.avis.reduce(
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
      DEMANDES_COLUMNS
    );
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("saisie_demandes:export-excel");
    const data = await client.ref("[GET]/demandes").query({
      query: isFiltered ? getDemandesQueryParameters() : {},
    });
    downloadExcel(
      formatExportFilename("recueil_demandes"),
      [
        ...data.demandes.map((demande) => ({
          ...demande,
          ...demande.avis.reduce(
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
      DEMANDES_COLUMNS
    );
  };

  const queryClient = useQueryClient();

  const {
    mutate: submitDemandesStatut,
    isLoading,
  } = client.ref("[POST]/demandes/statut/submit").useMutation({
    onMutate: () => {
      setIsModifyingGroup(true);
    },
    onError: (error) => {
      if(isAxiosError<DetailedApiError>(error)) {
        toast({
          variant: "left-accent",
          status: "error",
          title: Object.values(getDetailedErrorMessage(error) ?? {}).join(", ") ?? "Une erreur est survenue lors de la modification des demandes"
        });
      }
      setIsModifyingGroup(false);
    },
    onSuccess: async () => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "Les demandes ont été modifiées avec succès",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/demandes"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/demandes/count"],
        });
        setCheckedDemandes(undefined);
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
            <AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="externalLink" />
          </Flex>
          <SearchInput
            value={searchDemande}
            onChange={setSearchDemande}
            onClick={onClickSearchDemande}
            placeholder="30745A1I, Jules Verne, Cybersécurité..."
          />
        </Flex>
      </Flex>
      <Collapse in={checkedDemandes !== undefined && checkedDemandes.demandes.length > 0}>
        <Flex direction={"row"} gap={4} bgColor={"bluefrance.975"} p={4} justify={"space-between"} >
          <Flex my={"auto"}>
            {checkedDemandes && (
              <Text color={"bluefrance.113"} fontWeight={700} fontSize={16}>
                { checkedDemandes?.demandes && checkedDemandes.demandes.length > 1 ?
                  `${checkedDemandes.demandes.length} demandes sélectionnées` :
                  `${checkedDemandes?.demandes.length} demande sélectionnée`
                }
              </Text>
            )}
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
                {getPossibleNextStatuts({statut: checkedDemandes?.statut, user})?.map((statut) => (
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
                if(statut && checkedDemandes) onOpen();
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
      {checkedDemandes && statut && (
        <ModalModificationStatut
          isOpen={isOpen}
          onClose={onClose}
          checkedDemandes={checkedDemandes}
          statut={statut}
          submitDemandesStatut={submitDemandesStatut}
          isLoading={isLoading}
        />
      )}
    </Flex>
  );
};

const ModalModificationStatut = ({
  isOpen,
  onClose,
  checkedDemandes,
  statut,
  submitDemandesStatut,
  isLoading
} : {
  isOpen: boolean;
  onClose: () => void;
  checkedDemandes: CheckedDemandesType;
  statut: DemandeStatutType;
  submitDemandesStatut: (params: { body: { demandes: { numero: string }[], statut: DemandeStatutType } }) => void;
  isLoading: boolean;
}) => {

  const text = checkedDemandes.demandes.length > 1 ?
    `Souhaitez-vous changer le statut de ${checkedDemandes.demandes.length} demandes depuis
    ${formatStatut(checkedDemandes.statut)} vers ${formatStatut(statut)} ?`
    :
    `Souhaitez-vous changer le statut d"une demande depuis ${formatStatut(checkedDemandes.statut)} vers ${formatStatut(statut)} ?`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent p="4">
        <ModalCloseButton title="Fermer" />
        <ModalHeader>
          <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
          Confirmer le changement de statut
        </ModalHeader>
        <ModalBody>
          <Highlight
            query={[
              formatStatut(checkedDemandes.statut),
              formatStatut(statut),
              `${checkedDemandes.demandes.length} demandes`,
              "une demande"
            ]}
            styles={{ fontWeight: 700 }}
          >
            {text}
          </Highlight>
          <Text color="red" mt={2}>
              Attention, ce changement est irréversible
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isLoading}
            colorScheme="blue"
            mr={3}
            onClick={() => {
              onClose();
            }}
            variant={"secondary"}
          >
            Annuler
          </Button>
          <Button
            isLoading={isLoading}
            variant="primary"
            onClick={() => {
              submitDemandesStatut({
                body: {
                  demandes: checkedDemandes.demandes.map((demande) => ({numero: demande})),
                  statut,
                }
              });
              onClose();
            }}
          >
            Confirmer le changement
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
