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
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { client } from "@/api.client";
import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

import { ObservationsSection } from "./observationsSection/ObservationsSection";
import { PrecisionsSection } from "./precisionsSection/PrecisionsSection";
import { RHSection } from "./rhSection/RHSection";
import { StatusBlock } from "./statutSection/StatusBlock";
import { TypeDemandeSection } from "./typeDemandeSection/TypeDemandeSection";

export const InformationsBlock = ({
  formId,
  disabled,
  errors,
  footerActions,
}: {
  formId?: string;
  disabled: boolean;
  errors?: Record<string, string>;
  footerActions: ReactNode;
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
    <>
      <Box bg="white" p="6" mt="6" mb="6" borderRadius={6}>
        <TypeDemandeSection disabled={disabled} formId={formId} />
      </Box>
      <Box bg="white" p="6" mt="6" borderRadius={6}>
        <PrecisionsSection disabled={disabled} />
      </Box>
      <Box bg="white" p="6" mt="6" borderRadius={6}>
        <RHSection disabled={disabled} />
      </Box>
      <Box bg="white" p="6" mt="6" borderRadius={6}>
        <ObservationsSection disabled={disabled} />
      </Box>

      {formId && (
        <>
          <StatusBlock disabled={disabled} />
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
              {!formId && footerActions && (
                <Flex justify="flex-end" mt="12" mb="4" gap={6}>
                  {footerActions}
                </Flex>
              )}
            </>
          )}
          <Box bg="white" p="6" mt="6" borderRadius={6}>
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
                        setValue("statut", "refused");
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
          </Box>
        </>
      )}
    </>
  );
};
