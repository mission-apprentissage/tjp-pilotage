import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  Highlight,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { client } from "@/api.client";
import { AvisStatutTag } from "@/app/(wrapped)/intentions/perdir/components/AvisStatutTag";
import { formatDate } from "@/utils/formatDate";
import { useAuth } from "@/utils/security/useAuth";
import { usePermission } from "@/utils/security/usePermission";
import { useRole } from "@/utils/security/useRole";

import { FonctionTag } from "../../../../components/FonctionTag";
import { Avis } from "../../../../types";
import { UpdateAvisForm } from "./UpdateAvisForm";

export const AvisSection = chakra(({ avis }: { avis: Avis }) => {
  const { auth } = useAuth();
  const toast = useToast();

  const hasPermissionModificationAvis = () => {
    if (usePermission("intentions-perdir-avis/ecriture")) {
      if (useRole("expert_region") || useRole("region")) {
        if (avis.userId === auth?.user.id) return true;
        return false;
      } else return true;
    }
    return false;
  };

  const [isModifying, setIsModifying] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutateAsync: submitDeleteAvisCommentaire } =
    useMutation({
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
        queryClient.invalidateQueries(["[GET]/intention/:numero"]);
      },
    });

  return (
    <Box borderLeftColor={"grey.900"} borderLeftWidth={"0.5px"} pl={6}>
      <Flex direction={"column"} gap={2} p={2}>
        <Flex direction={"column"} gap={4}>
          <Flex direction={"row"} gap={2}>
            <Flex mx={2}>
              <Tooltip label={avis.userFullName} mb={"auto"}>
                <Avatar
                  name={avis.userFullName}
                  bg={"blueecume.850"}
                  color={"black"}
                  position={"unset"}
                />
              </Tooltip>
            </Flex>
            <Flex direction={"column"}>
              <Flex direction={"row"} gap={2}>
                <AvisStatutTag
                  hasIcon
                  size={"md"}
                  statutAvis={avis.statutAvis}
                  typeAvis={avis.typeAvis}
                />
                <FonctionTag fonction={avis.userFonction} />
              </Flex>
              <Text fontSize={12} fontWeight={400} lineHeight={"20px"}>
                <Highlight
                  query={avis.userFullName}
                  styles={{ color: "bluefrance.113" }}
                >
                  {`Avis saisi par ${avis.userFullName}`}
                </Highlight>
              </Text>
            </Flex>
          </Flex>
          <Text
            fontSize={12}
            fontWeight={400}
            lineHeight={"20px"}
            fontStyle={"italic"}
            color="grey.425"
          >
            {`Publié le ${formatDate({
              date: avis.updatedAt,
              options: {
                dateStyle: "short",
                timeStyle: "short",
              },
              dateTimeSeparator: " - ",
            })}`}
          </Text>
        </Flex>
        {isModifying ? (
          <UpdateAvisForm avis={avis} setIsModifying={setIsModifying} />
        ) : avis.commentaire ? (
          <Text
            fontSize={16}
            fontWeight={500}
            lineHeight={"24px"}
            color={"grey.50"}
          >
            « {avis.commentaire} »
          </Text>
        ) : (
          <Text
            fontSize={16}
            fontWeight={500}
            lineHeight={"24px"}
            color={"grey.900"}
          >
            Pas d'observation renseignée
          </Text>
        )}
        {hasPermissionModificationAvis() && !isDeleting && !isModifying && (
          <Flex direction={"row"} gap={6}>
            <Button
              isLoading={isDeleting || isModifying}
              variant={"link"}
              color="bluefrance.113"
              fontSize={12}
              fontWeight={400}
              onClick={() => submitDeleteAvisCommentaire()}
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
  );
});
