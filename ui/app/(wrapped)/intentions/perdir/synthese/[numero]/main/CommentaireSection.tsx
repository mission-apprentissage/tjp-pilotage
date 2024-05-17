import {
  Avatar,
  Box,
  chakra,
  Flex,
  Highlight,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { Role } from "shared";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { formatDate } from "@/utils/formatDate";

import { formatRole } from "../../../../utils/roleUtils";
import { formatStatut } from "../../../../utils/statutUtils";

const StatutTag = chakra(
  ({
    className,
    statut,
  }: {
    className?: string;
    statut: DemandeStatutType;
  }) => (
    <Tag
      className={className}
      size={"md"}
      variant={"solid"}
      bgColor={"success.950"}
      color={"success.425"}
      gap={1}
      fontSize={12}
      fontWeight={700}
    >
      <Icon icon={"ep:success-filled"} />
      {formatStatut(statut)}
    </Tag>
  )
);

const RoleTag = chakra(
  ({ className, role }: { className?: string; role?: Role }) => {
    if (!role) return null;
    return (
      <Tag
        className={className}
        size={"md"}
        variant={"solid"}
        bgColor={"info.950"}
        color={"info.text"}
        gap={1}
        fontSize={12}
        fontWeight={700}
        textTransform={"uppercase"}
      >
        {formatRole(role)}
      </Tag>
    );
  }
);

export const CommentaireSection = chakra(
  ({
    changementStatut,
  }: {
    changementStatut: {
      statut: DemandeStatutType;
      userId: string;
      userRole?: string;
      userFullName: string;
      updatedAt: string;
      commentaire?: string;
    };
  }) => {
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
                  <StatutTag statut={changementStatut.statut} />
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

          {changementStatut.commentaire ? (
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
        </Flex>
      </Box>
    );
  }
);
