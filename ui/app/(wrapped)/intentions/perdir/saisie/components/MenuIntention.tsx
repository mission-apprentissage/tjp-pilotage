import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { Filters } from "../types";
import { isSaisieDisabled } from "../utils/isSaisieDisabled";

export const MenuIntention = ({
  isRecapView = false,
  hasPermissionEnvoi,
  campagne,
}: {
  isRecapView?: boolean;
  hasPermissionEnvoi: boolean;
  campagne?: { annee: string; statut: string };
}) => {
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    campagne?: string;
  } = qs.parse(queryParams.toString());

  const statut =
    searchParams.filters === undefined ? "none" : searchParams.filters?.statut;
  const anneeCampagne = searchParams.campagne ?? campagne?.annee;
  const isCampagneEnCours = campagne?.statut === CampagneStatutEnum["en cours"];
  const isDisabled =
    !isCampagneEnCours || isSaisieDisabled() || !hasPermissionEnvoi;

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

  return (
    <Flex direction="column" pr={[null, null, 4]} minW={250} gap={4}>
      <Button
        isDisabled={isDisabled}
        mb="4"
        variant="createButton"
        size={"md"}
        width={"100%"}
        as={hasPermissionEnvoi && !isSaisieDisabled() ? NextLink : undefined}
        href="/intentions/perdir/saisie/new"
      >
        Nouvelle demande
      </Button>

      <VStack flex="1" align="flex-start" spacing={2}>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href={createParametrizedUrl(location.pathname, {
            ...searchParams,
            filters: {
              ..._.omit(searchParams.filters, ["statut"]),
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={<Text fontWeight={"normal"}>{countDemandes?.total}</Text>}
        >
          <Text
            fontWeight={isRecapView && statut === "none" ? "bold" : "normal"}
          >
            Toutes
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href={createParametrizedUrl(location.pathname, {
            ...searchParams,
            filters: {
              ...searchParams.filters,
              statut: DemandeStatutEnum["brouillon"],
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>{countDemandes?.["brouillon"]}</Text>
          }
        >
          <Text
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["brouillon"]
                ? "bold"
                : "normal"
            }
          >
            Brouillons
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href={createParametrizedUrl(location.pathname, {
            ...searchParams,
            filters: {
              ...searchParams.filters,
              statut: DemandeStatutEnum["demande validée"],
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>
              {countDemandes?.["demande validée"]}
            </Text>
          }
        >
          <Text
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["demande validée"]
                ? "bold"
                : "normal"
            }
          >
            Demandes validées
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href={createParametrizedUrl(location.pathname, {
            ...searchParams,
            filters: {
              ...searchParams.filters,
              statut: DemandeStatutEnum["proposition"],
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>{countDemandes?.["proposition"]}</Text>
          }
        >
          <Text
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["proposition"]
                ? "bold"
                : "normal"
            }
          >
            Propositions
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href={createParametrizedUrl(location.pathname, {
            ...searchParams,
            filters: {
              ...searchParams.filters,
              statut: DemandeStatutEnum["refusée"],
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>{countDemandes?.["refusée"]}</Text>
          }
        >
          <Text
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["refusée"]
                ? "bold"
                : "normal"
            }
          >
            Demandes refusées
          </Text>
        </Button>

        <Button
          variant="ghost"
          mb="2"
          as={NextLink}
          size="sm"
          mt="auto"
          href="/intentions/perdir/saisie/documentation"
          width={"100%"}
          leftIcon={<QuestionOutlineIcon />}
        >
          Documentation
        </Button>
      </VStack>
    </Flex>
  );
};
