import { chakra, Flex, IconButton,Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { hasPermission } from "shared";
import type {DemandeStatutType} from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum  } from "shared/enum/demandeStatutEnum";
import { PermissionEnum } from "shared/enum/permissionEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";

import type { Demandes } from "@/app/(wrapped)/demandes/saisie/types";
import { canCorrectDemande, canEditDemande, canEditDemandeCfdUai, canEditDemandeStatut } from "@/app/(wrapped)/demandes/utils/permissionsDemandeUtils";
import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";


export const ModificationDemandeButton = chakra(
  ({
    user,
    demande,
    campagne,
    onChangeCheckedDemandes,
    setStatut
  }: {
    user?: UserType;
    demande: Demandes[number];
    campagne: CampagneType;
    onChangeCheckedDemandes: (demande: { statut: DemandeStatutType, numero: string }) => void;
    setStatut: (statut: DemandeStatutType | undefined) => void;
  }) => {
    const router = useRouter();
    const bluefrance113 = useToken("colors", "bluefrance.113");

    const canEdit = canEditDemande({ demande: { ...demande, campagne }, user });
    const canEditCfdUai = canEditDemandeCfdUai({ demande, user });
    const canEditStatut = canEditDemandeStatut({ demande: { ...demande, campagne }, user }) && hasPermission(user?.role, PermissionEnum["demande-statut/ecriture"]);
    const canCorrect = canCorrectDemande({ demande: { ...demande, campagne }, user });

    if (!canEdit && !canEditCfdUai && !canEditStatut && !canCorrect) return null;

    return (
      <Menu gutter={0} >
        <Tooltip label="Modifier la demande" shouldWrapChildren>
          <MenuButton
            as={IconButton}
            icon={<Icon icon="ri:pencil-line" width={"24px"} color={bluefrance113} />}
            bgColor={"transparent"}
            borderRadius="0"
            p={2}
            h={"fit-content"}
            onClick={(e) => {
              e.stopPropagation();
            }}
            aria-label="Modifier la demande"
          />
        </Tooltip>
        <MenuList p={0}>
          {canEdit && (
            <MenuItem
              px={2}
              py={3}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(getRoutingAccessSaisieDemande({user, campagne, suffix: demande.numero}));
              }}
            >
              <Flex direction={"row"} h={"100%"} w="100%" gap={2}>
                <Icon icon="ri:edit-line" color={bluefrance113} width={"18px"} />
                <Text color={bluefrance113}>Modifier la demande</Text>
              </Flex>
            </MenuItem>
          )}
          {!canEdit && canEditCfdUai && (
            <MenuItem
              px={2}
              py={3}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(getRoutingAccessSaisieDemande({user, campagne, suffix: `${demande.numero}?editCfdUai=true`}));
              }}
            >
              <Flex direction={"row"} h={"100%"} w="100%" gap={2}>
                <Icon icon="ri:edit-line" color={bluefrance113} width={"18px"} />
                <Text color={bluefrance113}>Modifier la formation ou l'établissement</Text>
              </Flex>
            </MenuItem>
          )}
          {canEditStatut && (
            <MenuItem
              px={2}
              py={3}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChangeCheckedDemandes(demande);
              }}
            >
              <Flex direction={"row"} h={"100%"} w="100%" gap={2}>
                <Icon icon="ri:contract-line" color={bluefrance113} width={"18px"} />
                <Text color={bluefrance113}>Modifier le statut de la demande</Text>
              </Flex>
            </MenuItem>
          )}
          {canCorrect && (
            <>
              <MenuItem
                px={2}
                py={3}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(getRoutingAccessSaisieDemande({user, campagne, suffix: `${demande.numero}?correction=true`}));
                }}
              >
                <Flex direction={"row"} h={"100%"} gap={2}>
                  <Icon icon="ri:scales-3-line" color={bluefrance113} width={"18px"} />
                  <Text color={bluefrance113}>Rectifier les capacités</Text>
                </Flex>
              </MenuItem>
              <MenuItem
                px={2}
                py={3}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(getRoutingAccessSaisieDemande({user, campagne, suffix: `${demande.numero}?report=true`}));
                }}
              >
                <Flex direction={"row"} h={"100%"} gap={2}>
                  <Icon icon="ri:corner-up-left-line" color={bluefrance113} width={"18px"} />
                  <Text color={bluefrance113}>Reporter la demande</Text>
                </Flex>
              </MenuItem>
              <MenuItem
                px={2}
                py={3}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChangeCheckedDemandes(demande);
                  setStatut(DemandeStatutEnum["refusée"]);
                }}
              >
                <Flex direction={"row"} h={"100%"} gap={2}>
                  <Icon icon="ri:close-line" color={bluefrance113} width={"18px"} />
                  <Text color={bluefrance113}>Annuler la demande</Text>
                </Flex>
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    );
  }
);
