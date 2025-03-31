import {Button, Divider, Flex, Text, Tooltip,useToken, VStack} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";

import { client } from "@/api.client";
import type { Filters } from "@/app/(wrapped)/intentions/saisie/types";
import {getMessageAccompagnementCampagne} from '@/app/(wrapped)/intentions/utils/messageAccompagnementUtils';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useCurrentCampagne } from '@/utils/security/useCurrentCampagne';

export const MenuBoiteReception = ({
  isRecapView = false,
  isNouvelleDemandeDisabled,
  handleFilters,
  activeFilters,
  campagne,
  user
}: {
  isRecapView?: boolean;
  isNouvelleDemandeDisabled: boolean;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  activeFilters: Partial<Filters>;
  campagne: CampagneType;
  user: UserType;
}) => {
  const { campagne: currentCampagne } = useCurrentCampagne();
  const statut = activeFilters?.statut === undefined ? "none" : activeFilters?.statut;

  const { data: countDemandes } = client.ref("[GET]/demandes/count").useQuery({
    query: activeFilters,
  });

  const bluefrance113 = useToken("colors", "bluefrance.113");

  return (
    <Flex direction="column" pr={[null, null, 4]} minW={250} gap={4}>
      <Tooltip
        label={getMessageAccompagnementCampagne({ campagne, currentCampagne: currentCampagne!, user })}
        shouldWrapChildren
        placement="bottom-start"
      >
        <Flex>
          <Button
            mb={1.5}
            variant="primary"
            isDisabled={isNouvelleDemandeDisabled}
            leftIcon={<Icon icon="ri:file-add-line" height={"20px"} />}
            as={isNouvelleDemandeDisabled ? undefined : NextLink}
            href={isNouvelleDemandeDisabled ? undefined : getRoutingSaisieRecueilDemande({campagne, user, suffix: `new?campagneId=${campagne?.id}`})}
            minHeight={"35px"}
            w={"100%"}
          >
            Nouvelle demande
          </Button>
        </Flex>
      </Tooltip>
      <VStack flex="1" align="flex-start" spacing={1}>
        {/* Toutes */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", undefined)}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:stack-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text fontWeight={isRecapView && statut === "none" ? "bold" : "normal"} fontSize={14}>
              {countDemandes?.total}
            </Text>
          }
          isActive={statut === "none"}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text fontWeight={isRecapView && statut === "none" ? "bold" : "normal"} fontSize={14} me={"auto"}>
            Toutes
          </Text>
        </Button>
        {/* Projet de demande */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["projet de demande"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:file-text-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === DemandeStatutEnum["projet de demande"] ? "bold" : "normal"}
              fontSize={14}
            >
              {countDemandes?.[DemandeStatutEnum["projet de demande"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["projet de demande"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["projet de demande"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Projet de demande
          </Text>
        </Button>

        {/* Demandes validées */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["demande validée"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:checkbox-circle-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === DemandeStatutEnum["demande validée"] ? "bold" : "normal"}
              fontSize={14}
            >
              {countDemandes?.[DemandeStatutEnum["demande validée"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["demande validée"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["demande validée"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Demandes validées
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["refusée"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:close-circle-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text fontWeight={isRecapView && statut === DemandeStatutEnum["refusée"] ? "bold" : "normal"} fontSize={14}>
              {countDemandes?.[DemandeStatutEnum["refusée"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["refusée"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["refusée"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Demandes refusées
          </Text>
        </Button>
        <Divider my={2} />
        <Text fontSize={12} color="grey.425" mb={1}>
          Visible par vous uniquement
        </Text>

        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => {
            handleFilters("statut", "suivies");
          }}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon width="24px" icon="ri:bookmark-line" color={bluefrance113} />}
          rightIcon={
            <Text fontWeight={isRecapView && statut === "suivies" ? "bold" : "normal"} fontSize={14}>
              {countDemandes?.["suivies"]}
            </Text>
          }
          isActive={statut === "suivies"}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text fontWeight={isRecapView && statut === "suivies" ? "bold" : "normal"} fontSize={14} me={"auto"}>
            Demandes suivies
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["brouillon"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:draft-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === DemandeStatutEnum["brouillon"] ? "bold" : "normal"}
              fontSize={14}
            >
              {countDemandes?.[DemandeStatutEnum["brouillon"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["brouillon"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["brouillon"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Brouillons
          </Text>
        </Button>
      </VStack>
    </Flex>
  );
};
