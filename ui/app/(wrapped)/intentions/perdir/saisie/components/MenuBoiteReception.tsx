import { Button, Divider, Flex, Text, useToken, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { CampagneType } from "shared/schema/campagneSchema";

import { client } from "@/api.client";
import type { Filters } from "@/app/(wrapped)/intentions/perdir/saisie/types";
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";

export const MenuBoiteReception = ({
  isRecapView = false,
  isNouvelleDemandeDisabled,
  handleFilters,
  activeFilters,
  campagne
}: {
  isRecapView?: boolean;
  isNouvelleDemandeDisabled: boolean;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  activeFilters: Partial<Filters>;
  campagne: CampagneType;
}) => {
  const { auth } = useAuth();
  const statut = activeFilters.statut === undefined ? "none" : activeFilters.statut;

  const { data: countIntentions } = client.ref("[GET]/intentions/count").useQuery({
    query: {
      ...activeFilters,
    },
  });

  const bluefrance113 = useToken("colors", "bluefrance.113");

  return (
    <Flex direction="column" pr={[null, null, 4]} minW={250} gap={4}>
      <Button
        mb={1.5}
        variant="primary"
        isDisabled={isNouvelleDemandeDisabled}
        leftIcon={<Icon icon="ri:file-add-line" height={"20px"} />}
        as={!isNouvelleDemandeDisabled ? NextLink : undefined}
        href={`${getRoutingSaisieRecueilDemande({ user: auth?.user, campagne, suffix: "new" })}`}
        minHeight={"35px"}
      >
        Nouvelle demande
      </Button>
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
              {countIntentions?.total}
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

        {/* Dossiers complets */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["dossier complet"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:task-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === DemandeStatutEnum["dossier complet"] ? "bold" : "normal"}
              fontSize={14}
            >
              {countIntentions?.[DemandeStatutEnum["dossier complet"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["dossier complet"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["dossier complet"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Dossiers complets
          </Text>
        </Button>

        {/* Dossiers incomplets */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["dossier incomplet"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:file-warning-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === DemandeStatutEnum["dossier incomplet"] ? "bold" : "normal"}
              fontSize={14}
            >
              {countIntentions?.[DemandeStatutEnum["dossier incomplet"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["dossier incomplet"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["dossier incomplet"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Dossiers incomplets
          </Text>
        </Button>

        {/* Propositions */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["proposition"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:file-unknow-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === DemandeStatutEnum["proposition"] ? "bold" : "normal"}
              fontSize={14}
            >
              {countIntentions?.[DemandeStatutEnum["proposition"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["proposition"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["proposition"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Propositions
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
              {countIntentions?.[DemandeStatutEnum["projet de demande"]]}
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

        {/* Prêts pour le vote */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["prêt pour le vote"])}
          width={"100%"}
          iconSpacing={2}
          leftIcon={<Icon icon={"ri:file-user-line"} color={bluefrance113} width={"24px"} />}
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === DemandeStatutEnum["prêt pour le vote"] ? "bold" : "normal"}
              fontSize={14}
            >
              {countIntentions?.[DemandeStatutEnum["prêt pour le vote"]]}
            </Text>
          }
          isActive={statut === DemandeStatutEnum["prêt pour le vote"]}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={isRecapView && statut === DemandeStatutEnum["prêt pour le vote"] ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Prêt pour le vote
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
              {countIntentions?.[DemandeStatutEnum["demande validée"]]}
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
              {countIntentions?.[DemandeStatutEnum["refusée"]]}
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
              {countIntentions?.["suivies"]}
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
              {countIntentions?.[DemandeStatutEnum["brouillon"]]}
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
