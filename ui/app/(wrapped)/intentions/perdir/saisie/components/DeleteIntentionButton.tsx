import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  chakra,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  useToken,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { client } from "@/api.client";
import type { Intentions } from "@/app/(wrapped)/intentions/perdir/saisie/types";

import { IntentionSpinner } from "./IntentionSpinner";

export const DeleteIntentionButton = chakra(
  ({ intention }: { intention: Intentions[number] }) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bluefrance113 = useToken("colors", "bluefrance.113");

    const [isDeleting, setIsDeleting] = useState(false);

    const { mutate: deleteIntention } = client.ref("[DELETE]/intention/:numero").useMutation({
      onMutate: () => {
        setIsDeleting(true);
      },
      onSuccess: (_body) => {
        toast({
          variant: "left-accent",
          status: "success",
          title: "La intention a bien été supprimée",
        });
        // Wait until view is updated before invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["[GET]/intentions"] });
          queryClient.invalidateQueries({
            queryKey: ["[GET]/intentions/count"],
          });
          setIsDeleting(false);
          onClose();
        }, 500);
      },
    });

    return (
      <>
        <Tooltip label="Supprimer la demande" closeOnScroll={true}>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen();
            }}
            aria-label="Supprimer la demande"
            color={"bluefrance.113"}
            bgColor={"transparent"}
            icon={<Icon icon="ri:delete-bin-line" width={"24px"} color={bluefrance113} />}
          />
        </Tooltip>
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
          <ModalOverlay />
          <ModalContent p="4">
            <ModalCloseButton title="Fermer" />
            <ModalHeader>
              <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
              Confirmer la suppression de l'intention n°{intention.numero}
            </ModalHeader>
            <ModalBody>
              <Text color="red" mt={2}>
                Attention, ce changement est irréversible
              </Text>
            </ModalBody>

            {isDeleting ? (
              <Center>
                <IntentionSpinner />
              </Center>
            ) : (
              <ModalFooter>
                <Button colorScheme="blue" mr={3} variant={"secondary"} onClick={() => onClose()}>
                  Annuler
                </Button>

                <Button
                  isLoading={isDeleting}
                  variant="primary"
                  onClick={() =>
                    deleteIntention({
                      params: { numero: intention.numero },
                    })
                  }
                >
                  Confirmer la suppression
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
);
