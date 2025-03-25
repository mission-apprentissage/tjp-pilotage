import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  chakra,
  Collapse,
  Flex,
  Highlight,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SlideFade,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { hasRole } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import {RoleEnum} from 'shared/enum/roleEnum';

import { client } from "@/api.client";
import { AvisStatutTag } from "@/app/(wrapped)/intentions/components/AvisStatutTag";
import { FonctionTag } from "@/app/(wrapped)/intentions/components/FonctionTag";
import type { Avis } from "@/app/(wrapped)/intentions/perdir/types";
import { isChangementStatutAvisDisabled } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { formatDate } from "@/utils/formatUtils";
import { useAuth } from "@/utils/security/useAuth";
import { usePermission } from "@/utils/security/usePermission";

import { UpdateAvisForm } from "./UpdateAvisForm";

export const AvisSection = chakra(({ avis, statut }: { avis: Avis; statut: DemandeStatutType }) => {
  const { user } = useAuth();
  const toast = useToast();

  const hasPermissionModificationAvis = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (usePermission(PermissionEnum["intentions-perdir-avis/ecriture"])) {
      // TODO
      if (hasRole({ user, role: RoleEnum["expert_region"] }) || hasRole({ user, role: RoleEnum["region"] })) {
        if (avis.createdBy === user?.id) return true;
        return false;
      } else return true;
    }
    return false;
  };

  const [isModifying, setIsModifying] = useState(false);

  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDeleteAvis, onToggle: onToggleDeleteAvis } = useDisclosure({
    defaultIsOpen: true,
  });

  const { isOpen: isOpenUpdateAvis, onToggle: onToggleUpdateAvis } = useDisclosure({
    defaultIsOpen: true,
  });

  const { isLoading: isDeleting, mutateAsync: submitDeleteAvisCommentaire } = useMutation({
    mutationFn: async () => {
      await client.ref("[DELETE]/intention/avis/:id").query({
        params: {
          id: avis.id,
        },
      });
    },
    onSuccess: () => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "Avis supprimé",
      });

      setTimeout(() => {
        queryClient.invalidateQueries(["[GET]/intention/:numero"]);
      }, 500);
    },
  });

  return (
    <Collapse in={isOpenDeleteAvis}>
      <SlideFade in={isOpenUpdateAvis} offsetX="50px" reverse>
        <Box borderLeftColor={"grey.900"} borderLeftWidth={"0.5px"} pl={6} my={5}>
          <Flex direction={"column"} gap={2} p={2}>
            <Flex direction={"column"} gap={4}>
              <Flex direction={"row"} gap={2}>
                <Flex mx={2}>
                  <Tooltip label={avis.userFullName} mb={"auto"}>
                    <Avatar name={avis.userFullName} bg={"blueecume.850"} color={"black"} position={"unset"} />
                  </Tooltip>
                </Flex>
                <Flex direction={"column"}>
                  <Flex direction={"row"} gap={2}>
                    <AvisStatutTag hasIcon size={"md"} statutAvis={avis.statutAvis} typeAvis={avis.typeAvis} />
                    <FonctionTag fonction={avis.userFonction} />
                  </Flex>
                  <Text fontSize={12} fontWeight={400} lineHeight={"20px"}>
                    <Highlight query={avis.userFullName} styles={{ color: "bluefrance.113" }}>
                      {`Avis saisi par ${avis.userFullName}`}
                    </Highlight>
                  </Text>
                </Flex>
              </Flex>
              <Text fontSize={12} fontWeight={400} lineHeight={"20px"} fontStyle={"italic"} color="grey.425">
                {avis.updatedAt === avis.createdAt || avis.updatedByFullName === "" ? (
                  `Publié le ${formatDate({
                    date: avis.createdAt,
                    options: {
                      dateStyle: "short",
                      timeStyle: "short",
                    },
                    dateTimeSeparator: " - ",
                  })}`
                ) : (
                  <Highlight query={avis.updatedByFullName ?? ""} styles={{ color: "bluefrance.113" }}>
                    {`Modifié le ${formatDate({
                      date: avis.updatedAt,
                      options: {
                        dateStyle: "short",
                        timeStyle: "short",
                      },
                      dateTimeSeparator: " - ",
                    })} par ${avis.updatedByFullName}`}
                  </Highlight>
                )}
              </Text>
            </Flex>
            {isModifying ? (
              <UpdateAvisForm avis={avis} setIsModifying={setIsModifying} onToggleUpdateAvis={onToggleUpdateAvis} />
            ) : avis.commentaire ? (
              <Text fontSize={16} fontWeight={500} lineHeight={"24px"} color={"grey.50"}>
                « {avis.commentaire} »
              </Text>
            ) : (
              <Text fontSize={16} fontWeight={500} lineHeight={"24px"} color={"grey.900"}>
                Pas d'observation renseignée
              </Text>
            )}
            {hasPermissionModificationAvis() &&
              !isChangementStatutAvisDisabled(statut) &&
              !isDeleting &&
              !isModifying && (
              <Flex direction={"row"} gap={6}>
                <Button
                  isLoading={isDeleting || isModifying}
                  variant={"link"}
                  color="bluefrance.113"
                  fontSize={12}
                  fontWeight={400}
                  onClick={() => onOpen()}
                >
                    Supprimer
                </Button>
                <Button
                  variant={"link"}
                  color="bluefrance.113"
                  fontSize={12}
                  fontWeight={400}
                  isLoading={isDeleting || isModifying}
                  onClick={() => setIsModifying(true)}
                >
                    Modifier
                </Button>
              </Flex>
            )}
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent p="4">
              <ModalCloseButton title="Fermer" />
              <ModalHeader>
                <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                Confirmer la suppression de l'avis
              </ModalHeader>
              <ModalBody>
                <Highlight query={[avis.typeAvis, avis.statutAvis, avis.userFullName]} styles={{ fontWeight: 700 }}>
                  {`Confirmez-vous vouloir supprimer l'avis ${avis.typeAvis} ${avis.statutAvis} de ${avis.userFullName} ?`}
                </Highlight>
                <Text color="red" mt={2}>
                  Attention, cette action est irréversible
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button
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
                  isLoading={isDeleting}
                  variant="primary"
                  onClick={() => {
                    submitDeleteAvisCommentaire();
                    onToggleDeleteAvis();
                  }}
                >
                  Confirmer la suppression
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </SlideFade>
    </Collapse>
  );
});
