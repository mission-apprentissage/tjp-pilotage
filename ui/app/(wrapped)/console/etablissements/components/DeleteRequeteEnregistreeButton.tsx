import { CloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { client } from "@/api.client";
import { RequetesEnregistrees } from "@/app/(wrapped)/console/formations/types";
export const DeleteRequeteEnregistreeButton = ({
  requeteEnregistree,
}: {
  requeteEnregistree: RequetesEnregistrees[number];
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: deleteRequeteEnregistree } = client
    .ref("[DELETE]/requeteEnregistree/:id")
    .useMutation({
      onMutate: () => {
        setIsDeleting(true);
      },
      onSuccess: (_body) => {
        toast({
          variant: "left-accent",
          status: "success",
          title: "La requête favori a bien été supprimée",
        });
        // Wait until view is updated before invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["[GET]/requetesEnregistrees"],
          });
          setIsDeleting(false);
          onClose();
        }, 500);
      },
    });

  return (
    <>
      <IconButton
        aria-label="Supprimer"
        icon={<CloseIcon />}
        m={0}
        ms={"auto"}
        zIndex={4}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        size="xs"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer la suppression de la requête favori
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertDescription>
                Vous êtes sur le point de supprimer la requête favori{" "}
                <Text as="strong">{requeteEnregistree.nom}</Text>. Cette action
                est irréversible.
              </AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="primary"
              ml={3}
              onClick={() =>
                deleteRequeteEnregistree({
                  params: { id: requeteEnregistree.id },
                })
              }
              disabled={isDeleting}
            >
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
