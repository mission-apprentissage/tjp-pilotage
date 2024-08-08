import {
  Button,
  Divider,
  Flex,
  Text,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";

import { Filters } from "../types";
import { isSaisieDisabled } from "../utils/canEditIntention";

export const MenuIntention = ({
  isRecapView = false,
  hasPermissionSubmitIntention,
  campagne,
  handleFilters,
  searchParams,
}: {
  isRecapView?: boolean;
  hasPermissionSubmitIntention: boolean;
  campagne?: { annee: string; statut: string };
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  searchParams: {
    filters?: Partial<Filters>;
    campagne?: string;
  };
}) => {
  const statut =
    searchParams.filters?.statut === undefined
      ? "none"
      : searchParams.filters?.statut;
  const suivies = searchParams.filters?.suivies;
  const anneeCampagne = searchParams.campagne ?? campagne?.annee;
  const isCampagneEnCours = campagne?.statut === CampagneStatutEnum["en cours"];
  const isDisabled =
    !isCampagneEnCours || isSaisieDisabled() || !hasPermissionSubmitIntention;

  const { data: countDemandes } = client.ref("[GET]/intentions/count").useQuery(
    {
      query: {
        anneeCampagne,
      },
    },
    {
      keepPreviousData: true,
      staleTime: 0,
    }
  );

  const bluefrance113 = useToken("colors", "bluefrance.113");

  return (
    <Flex direction="column" pr={[null, null, 4]} minW={250} gap={4}>
      <Button
        mb={1.5}
        variant="primary"
        isDisabled={isDisabled}
        leftIcon={<Icon icon="ri:file-add-line" height={"20px"} />}
        as={
          hasPermissionSubmitIntention && !isSaisieDisabled()
            ? NextLink
            : undefined
        }
        href="/intentions/perdir/saisie/new"
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
          leftIcon={
            <Icon icon={"ri:stack-line"} color={bluefrance113} width={"24px"} />
          }
          rightIcon={
            <Text
              fontWeight={isRecapView && statut === "none" ? "bold" : "normal"}
              fontSize={14}
            >
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
          <Text
            fontWeight={isRecapView && statut === "none" ? "bold" : "normal"}
            fontSize={14}
            me={"auto"}
          >
            Toutes
          </Text>
        </Button>

        {/* Dossiers complets */}
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["dossier complet"])
          }
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon icon={"ri:task-line"} color={bluefrance113} width={"24px"} />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["dossier complet"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["dossier complet"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["dossier complet"]
                ? "bold"
                : "normal"
            }
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
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["dossier incomplet"])
          }
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon
              icon={"ri:file-warning-line"}
              color={bluefrance113}
              width={"24px"}
            />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["dossier incomplet"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["dossier incomplet"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["dossier incomplet"]
                ? "bold"
                : "normal"
            }
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
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["proposition"])
          }
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon
              icon={"ri:file-unknow-line"}
              color={bluefrance113}
              width={"24px"}
            />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["proposition"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["proposition"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["proposition"]
                ? "bold"
                : "normal"
            }
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
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["projet de demande"])
          }
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon
              icon={"ri:file-text-line"}
              color={bluefrance113}
              width={"24px"}
            />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["projet de demande"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["projet de demande"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["projet de demande"]
                ? "bold"
                : "normal"
            }
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
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["prêt pour le vote"])
          }
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon
              icon={"ri:file-user-line"}
              color={bluefrance113}
              width={"24px"}
            />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["prêt pour le vote"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["prêt pour le vote"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["prêt pour le vote"]
                ? "bold"
                : "normal"
            }
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
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["demande validée"])
          }
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon
              icon={"ri:checkbox-circle-line"}
              color={bluefrance113}
              width={"24px"}
            />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["demande validée"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["demande validée"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["demande validée"]
                ? "bold"
                : "normal"
            }
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
          leftIcon={
            <Icon
              icon={"ri:close-circle-line"}
              color={bluefrance113}
              width={"24px"}
            />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["refusée"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["refusée"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["refusée"]
                ? "bold"
                : "normal"
            }
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
          onClick={() => handleFilters("suivies", true)}
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon width="24px" icon="ri:bookmark-line" color={bluefrance113} />
          }
          rightIcon={
            <Text
              fontWeight={isRecapView && suivies ? "bold" : "normal"}
              fontSize={14}
            >
              {countDemandes?.["suivies"]}
            </Text>
          }
          isActive={suivies}
          _active={{
            borderRadius: "none",
            bg: "bluefrance.950",
          }}
          p={5}
        >
          <Text
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["brouillon"]
                ? "bold"
                : "normal"
            }
            fontSize={14}
            me={"auto"}
          >
            Demandes suivies
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["brouillon"])
          }
          width={"100%"}
          iconSpacing={2}
          leftIcon={
            <Icon icon={"ri:draft-line"} color={bluefrance113} width={"24px"} />
          }
          rightIcon={
            <Text
              fontWeight={
                isRecapView && statut === DemandeStatutEnum["brouillon"]
                  ? "bold"
                  : "normal"
              }
              fontSize={14}
            >
              {countDemandes?.["brouillon"]}
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
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["brouillon"]
                ? "bold"
                : "normal"
            }
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
