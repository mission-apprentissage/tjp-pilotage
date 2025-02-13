import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  Highlight,
  SlideFade,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Role } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { RoleTag } from "@/app/(wrapped)/intentions/components/RoleTag";
import { StatutTag } from "@/app/(wrapped)/intentions/components/StatutTag";
import type { ChangementStatut } from "@/app/(wrapped)/intentions/perdir/types";
import { isChangementStatutAvisDisabled } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { formatDate } from "@/utils/formatUtils";
import { usePermission } from "@/utils/security/usePermission";

import { UpdateChangementStatutForm } from "./UpdateChangementStatutForm";

export const CommentaireSection = chakra(
  ({ changementStatut, statut }: { changementStatut: ChangementStatut; statut: DemandeStatutType }) => {
    const hasPermissionModificationStatut = usePermission("intentions-perdir-statut/ecriture");
    const [isModifying, setIsModifying] = useState(false);
    const queryClient = useQueryClient();

    const { isOpen: isOpenUpdateChangementStatut, onToggle: onToggleUpdateChangementStatut } = useDisclosure({
      defaultIsOpen: true,
    });

    const { isLoading: isDeleting, mutateAsync: submitDeleteChangementStatutCommentaire } = useMutation({
      mutationFn: async () => {
        await client.ref("[POST]/intention/statut/submit").query({
          body: {
            changementStatut: {
              ...changementStatut,
              commentaire: "",
            },
          },
        });
      },
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries(["[GET]/intention/:numero"]);
        }, 100);
      },
    });

    return (
      <SlideFade in={isOpenUpdateChangementStatut} offsetX="50px" reverse>
        <Box borderLeftColor={"grey.900"} borderLeftWidth={"0.5px"} pl={6} my={5}>
          <Flex direction={"column"} gap={2} p={2}>
            <Flex direction={"column"} gap={4}>
              <Flex direction={"row"} gap={2}>
                <Flex mx={2}>
                  <Tooltip label={changementStatut.userFullName} mb={"auto"}>
                    <Avatar
                      name={changementStatut.userFullName}
                      bg={"blueecume.850"}
                      color={"black"}
                      position={"unset"}
                    />
                  </Tooltip>
                </Flex>
                <Flex direction={"column"}>
                  <Flex direction={"row"} gap={2}>
                    <StatutTag
                      statut={changementStatut.statut}
                      size={"md"}
                      gap={1}
                      fontSize={12}
                      fontWeight={700}
                      hasIcon={true}
                    />
                    <RoleTag role={changementStatut.userRole as Role} />
                  </Flex>
                  <Text fontSize={12} fontWeight={400} lineHeight={"20px"}>
                    <Highlight query={changementStatut.userFullName} styles={{ color: "bluefrance.113" }}>
                      {`Statut modifié par ${changementStatut.userFullName}`}
                    </Highlight>
                  </Text>
                </Flex>
              </Flex>
              <Text fontSize={12} fontWeight={400} lineHeight={"20px"} fontStyle={"italic"} color="grey.425">
                {`Publié le ${formatDate({
                  date: changementStatut.updatedAt,
                  options: {
                    dateStyle: "short",
                    timeStyle: "short",
                  },
                  dateTimeSeparator: " - ",
                })}`}
              </Text>
            </Flex>

            {isModifying ? (
              <UpdateChangementStatutForm
                changementStatut={changementStatut}
                setIsModifying={setIsModifying}
                onToggleUpdateChangementStatut={onToggleUpdateChangementStatut}
              />
            ) : changementStatut.commentaire ? (
              <Text fontSize={16} fontWeight={500} lineHeight={"24px"} color={"grey.50"}>
                « {changementStatut.commentaire} »
              </Text>
            ) : (
              <Text fontSize={16} fontWeight={500} lineHeight={"24px"} color={"grey.900"}>
                Pas d'observation renseignée
              </Text>
            )}
            {hasPermissionModificationStatut &&
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
                  onClick={() => {
                    submitDeleteChangementStatutCommentaire();
                    onToggleUpdateChangementStatut();
                  }}
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
        </Box>
      </SlideFade>
    );
  }
);
