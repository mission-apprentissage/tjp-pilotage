import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { FC, MouseEventHandler } from "react";
import { useRef } from "react";

import { ArrowIcon } from "@/components/icons/arrowIcon";

export const ConfirmationDelete = ({
  Trigger,
  onConfirm,
}: {
  Trigger: FC<{ onClick: MouseEventHandler<HTMLButtonElement> }>;
  onConfirm: () => Promise<void>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  return (
    <>
      <Trigger onClick={onOpen} />
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} size="xl" isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius={0}>
            <AlertDialogBody>
              <Heading fontSize="3xl" mt="6">
                <ArrowIcon mr="2" mb="1" />
                Confirmation de suppression
              </Heading>
              <Text mt="4">Êtes-vous sûr de vouloir supprimer la demande ?</Text>
              <Text mt="4">
                Cette action est irréversible, vous perdrez l’ensemble des données associées à votre demande.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="secondary" ref={cancelRef} onClick={onClose}>
                Annuler
              </Button>
              <Button variant="primary" onClick={onConfirm} ml={3}>
                Confirmer la suppression
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
