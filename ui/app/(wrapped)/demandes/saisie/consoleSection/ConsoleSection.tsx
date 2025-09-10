import { ArrowForwardIcon,ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Collapse, Flex, Highlight, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Text, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { UserType } from "shared/schema/userSchema";

import { client } from "@/api.client";
import { StatutTag } from "@/app/(wrapped)/demandes/components/StatutTag";
import { GROUPED_DEMANDES_COLUMNS_OPTIONAL } from "@/app/(wrapped)/demandes/saisie/GROUPED_DEMANDES_COLUMNS";
import type { CheckedDemandesType } from "@/app/(wrapped)/demandes/saisie/page.client";
import type { DataDemande, Demande, DEMANDES_COLUMNS_KEYS,Order } from "@/app/(wrapped)/demandes/saisie/types";
import { formatStatut,getPossibleNextStatuts } from "@/app/(wrapped)/demandes/utils/statutUtils";
import type { DetailedApiError} from "@/utils/apiError";
import { getDetailedErrorMessage } from "@/utils/apiError";

import { HeadLineContent } from "./HeadLineContent";
import { LineContent } from "./LineContent";

const getCellBgColor = (column: DEMANDES_COLUMNS_KEYS) => {
  const groupLabel = Object.keys(GROUPED_DEMANDES_COLUMNS_OPTIONAL).find((groupLabel) => {
    return Object.keys(GROUPED_DEMANDES_COLUMNS_OPTIONAL[groupLabel].options).includes(column);
  });
  return GROUPED_DEMANDES_COLUMNS_OPTIONAL[groupLabel as string].cellColor;
};

export const ConsoleSection = ({
  user,
  data,
  handleOrder,
  order,
  isLoading,
  canCheckDemandes,
  setIsModifyingGroup,
  colonneFilters,

}: {
  user?: UserType;
  data?: DataDemande;
  handleOrder: (column: Order["orderBy"]) => void;
  order: Partial<Order>;
  isLoading?: boolean;
  canCheckDemandes: boolean;
  setIsModifyingGroup: (value: boolean) => void;
  colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
}) => {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [statut, setStatut] = useState<DemandeStatutType | undefined>();

  const [checkedDemandes, setCheckedDemandes] = useState<CheckedDemandesType | undefined>();
  const [stickyColonnes, setStickyColonnes] = useState<DEMANDES_COLUMNS_KEYS[]>(["libelleFormation"]);

  const onChangeCheckedDemandes = (demande: { statut: DemandeStatutType, numero: string }) => {
    setCheckedDemandes((prevState: CheckedDemandesType | undefined) => {
      if (!prevState?.demandes.length) {
      // Si checkedDemandes est undefined on initialise avec le statut donné
        return {
          statut: demande.statut,
          demandes: [demande.numero],
        };
      }

      const { demandes } = prevState;
      if (demandes.includes(demande.numero)) {
      // Si la demande est la seule sélectionnée, on retire le statut
        if(demandes.length === 1) {
          return undefined;
        }
        // Si la demande est déjà présente, on la retire
        return {
          ...prevState,
          demandes: demandes.filter((i) => i !== demande.statut),
        };
      } else {
      // Sinon, on l'ajoute
        return {
          ...prevState,
          demandes: [...demandes, demande.numero],
        };
      }
    });
  };

  const queryClient = useQueryClient();

  const {
    mutate: submitDemandesStatut,
    isLoading: isSubmittingDemandeStatut,
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

  return (
    <>
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
          isSubmittingDemandeStatut={isSubmittingDemandeStatut}
        />
      )}
      <TableContainer overflowY="auto" flex={1} position="relative">
        <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" fontSize={14} gap="0">
          <HeadLineContent
            campagne={data?.campagne}
            handleOrder={handleOrder}
            order={order}
            canCheckDemandes={canCheckDemandes}
            checkedDemandes={checkedDemandes}
            setCheckedDemandes={setCheckedDemandes}
            colonneFilters={colonneFilters}
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            getCellBgColor={getCellBgColor}
          />
          <Tbody>
            {data?.demandes.map((demande: Demande) => {
              return (
                <Tr
                  height={"60px"}
                  key={demande.numero}
                  whiteSpace={"pre"}
                  fontWeight={demande.alreadyAccessed ? "400" : "700"}
                  bg={demande.alreadyAccessed ? "grey.975" : "white"}
                >
                  <LineContent
                    user={user}
                    demande={demande}
                    campagne={data?.campagne}
                    canCheckDemandes={canCheckDemandes}
                    checkedDemandes={checkedDemandes}
                    onChangeCheckedDemandes={onChangeCheckedDemandes}
                    isLoading={isLoading}
                    setStatut={setStatut}
                    colonneFilters={colonneFilters}
                    stickyColonnes={stickyColonnes}
                    getCellBgColor={getCellBgColor}
                  />
                </Tr>
              );})}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const ModalModificationStatut = ({
  isOpen,
  onClose,
  checkedDemandes,
  statut,
  submitDemandesStatut,
  isSubmittingDemandeStatut
} : {
  isOpen: boolean;
  onClose: () => void;
  checkedDemandes: CheckedDemandesType;
  statut: DemandeStatutType;
  submitDemandesStatut: (params: { body: { demandes: { numero: string }[], statut: DemandeStatutType } }) => void;
  isSubmittingDemandeStatut: boolean;
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
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isSubmittingDemandeStatut}
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
            isLoading={isSubmittingDemandeStatut}
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
