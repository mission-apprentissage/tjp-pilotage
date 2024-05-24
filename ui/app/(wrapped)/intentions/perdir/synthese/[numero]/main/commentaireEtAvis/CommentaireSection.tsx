import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  Highlight,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Role } from "shared";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { formatDate } from "@/utils/formatDate";

import { RoleTag } from "../../../../components/RoleTag";
import { StatutTag } from "../../../../components/StatutTag";
import { CommentaireForm } from "./CommentaireForm";

export const CommentaireSection = chakra(
  ({
    changementStatut,
  }: {
    changementStatut: {
      id: string;
      intentionNumero: string;
      userId: string;
      userRole?: string;
      userFullName: string;
      statutPrecedent?: Exclude<DemandeStatutType, "supprimée">;
      statut: Exclude<DemandeStatutType, "supprimée">;
      commentaire?: string;
      updatedAt: string;
    };
  }) => {
    const [isModifying, setIsModifying] = useState(false);

    const queryClient = useQueryClient();

    const {
      isLoading: isDeleting,
      mutateAsync: submitDeleteChangementStatutCommentaire,
    } = useMutation({
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
        queryClient.invalidateQueries(["[GET]/intention/:numero"]);
      },
    });
    return (
      <Box borderLeftColor={"grey.900"} borderLeftWidth={"0.5px"} pl={6}>
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
                  <Highlight
                    query={changementStatut.userFullName}
                    styles={{ color: "bluefrance.113" }}
                  >
                    {`Statut modifié par ${changementStatut.userFullName}`}
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
            <CommentaireForm
              changementStatut={changementStatut}
              setIsModifying={setIsModifying}
            />
          ) : changementStatut.commentaire ? (
            <Text
              fontSize={16}
              fontWeight={500}
              lineHeight={"24px"}
              color={"grey.50"}
            >
              « {changementStatut.commentaire} »
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
          {!isDeleting && !isModifying && (
            <Flex direction={"row"} gap={6}>
              <Button
                isLoading={isDeleting || isModifying}
                variant={"link"}
                color="bluefrance.113"
                fontSize={12}
                fontWeight={400}
                onClick={() => submitDeleteChangementStatutCommentaire()}
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
  }
);
