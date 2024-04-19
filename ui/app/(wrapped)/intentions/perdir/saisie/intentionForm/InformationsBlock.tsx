import { ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode, RefObject } from "react";
import { useFormContext } from "react-hook-form";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";

import { SectionBlock } from "../components/SectionBlock";
import { Campagne } from "../types";
import { IntentionForms } from "./defaultFormValues";
import { InternatEtRestaurationSection } from "./internatEtRestaurationSection/InternatEtRestaurationSection";
import { ObservationsSection } from "./observationsSection/ObservationsSection";
import { PrecisionsSection } from "./precisionsSection/PrecisionsSection";
import { RHSection } from "./rhSection/RHSection";
import { StatusBlock } from "./statutSection/StatusBlock";
import { TravauxEtEquipementsSection } from "./travauxEtEquipementsSection/TravauxEtEquipementsSection";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  refs,
  formId,
  disabled,
  errors,
  footerActions,
  campagne,
}: {
  refs: Record<string, RefObject<HTMLDivElement>>;
  formId?: string;
  disabled: boolean;
  errors?: Record<string, string>;
  footerActions: ReactNode;
  campagne?: Campagne;
}) => {
  const { push } = useRouter();
  const { setValue } = useFormContext<IntentionForms>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading: isDeleting, mutateAsync: deleteDemande } = useMutation({
    mutationFn: async () => {
      if (!formId) return;
      await client
        .ref("[DELETE]/demande/:numero")
        .query({ params: { numero: formId } })
        .then(() => push("/intentions/saisie?action=deleted"));
    },
  });

  return (
    <Flex direction="column" gap={6} mt={6}>
      <SectionBlock>
        <TypeDemandeSection
          typeDemandeRef={refs["typeDemande"]}
          disabled={disabled}
          campagne={campagne}
        />
      </SectionBlock>
      <SectionBlock>
        <PrecisionsSection
          motifsEtPrecisionsRef={refs["motifsEtPrecisions"]}
          disabled={disabled}
        />
      </SectionBlock>
      <SectionBlock>
        <RHSection
          ressourcesHumainesRef={refs["ressourcesHumaines"]}
          disabled={disabled}
        />
      </SectionBlock>
      <SectionBlock>
        <TravauxEtEquipementsSection
          travauxEtEquipementsRef={refs["travauxEtEquipements"]}
          disabled={disabled}
        />
      </SectionBlock>
      <SectionBlock>
        <InternatEtRestaurationSection
          internatEtRestaurationRef={refs["internatEtRestauration"]}
          disabled={disabled}
        />
      </SectionBlock>
      <SectionBlock>
        <ObservationsSection
          commentaireEtPiecesJointesRef={refs["commentaireEtPiecesJointes"]}
          disabled={disabled}
        />
      </SectionBlock>
      {formId && (
        <>
          <SectionBlock>
            <StatusBlock disabled={disabled} />
          </SectionBlock>
          <SectionBlock>
            <Flex justifyContent={"space-between"} flexDir={"row"}>
              <Button
                leftIcon={<DeleteIcon />}
                variant="ghost"
                color="bluefrance.113"
                onClick={onOpen}
                isDisabled={disabled}
              >
                Supprimer la demande
              </Button>
              <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent p="4">
                  <ModalCloseButton title="Fermer" />
                  <ModalHeader>
                    <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                    Confirmer la suppression de la demande
                  </ModalHeader>
                  <ModalBody>
                    <Text mb={4}>
                      Cette action est irréversible, elle supprime
                      définitivement la demande et l’ensemble des données
                      associées. Il est conseillé de réserver cette action à une
                      erreur de saisie ou un doublon.
                    </Text>
                    <Text>
                      Si vous souhaitez refuser la demande, vous pouvez la
                      conserver et modifier son statut en “Demande refusée”.
                    </Text>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={() => {
                        setValue("statut", DemandeStatutEnum.refused);
                        onClose();
                      }}
                      variant={"secondary"}
                    >
                      Passer en "Demande refusée"
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        deleteDemande();
                      }}
                      isLoading={isDeleting}
                    >
                      Supprimer définitivement
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {footerActions && <Flex>{footerActions}</Flex>}
            </Flex>
          </SectionBlock>
        </>
      )}
      {errors && (
        <>
          <Alert mt="8" alignItems="flex-start" status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Erreur(s) lors de l'envoi</AlertTitle>
              <AlertDescription mt="2">
                <UnorderedList>
                  {Object.entries(errors).map(([key, msg]) => (
                    <li key={key}>{msg}</li>
                  ))}
                </UnorderedList>
              </AlertDescription>
            </Box>
          </Alert>
        </>
      )}
      {!formId && footerActions && (
        <Flex justify="flex-end" mt="12" mb="4" gap={6}>
          {footerActions}
        </Flex>
      )}
    </Flex>
  );
};