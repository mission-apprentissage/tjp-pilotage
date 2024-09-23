import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";

import { Filters } from "../types";
import { isSaisieDisabled } from "../utils/isSaisieDisabled";

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
    search?: string;
  };
}) => {
  const statut =
    searchParams.filters === undefined ? "none" : searchParams.filters?.statut;
  const anneeCampagne = searchParams.campagne ?? campagne?.annee;
  const isCampagneEnCours = campagne?.statut === CampagneStatutEnum["en cours"];
  const isDisabled =
    !isCampagneEnCours || isSaisieDisabled() || !hasPermissionSubmitIntention;
  const search = searchParams.search;
  const codeAcademie = searchParams.filters?.codeAcademie;
  const codeNiveauDiplome = searchParams.filters?.codeNiveauDiplome;

  const { data: countDemandes } = client.ref("[GET]/demandes/count").useQuery(
    {
      query: {
        anneeCampagne,
        search,
        codeAcademie,
        codeNiveauDiplome,
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
        mb={1.5}
        variant="primary"
        isDisabled={isDisabled}
        leftIcon={<Icon icon="ri:file-add-line" height={"20px"} />}
        as={
          hasPermissionSubmitIntention && !isSaisieDisabled()
            ? NextLink
            : undefined
        }
        href="/intentions/saisie/new"
      >
        Nouvelle demande
      </Button>

      <VStack flex="1" align="flex-start" spacing={2}>
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", undefined)}
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
          size="sm"
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["demande validée"])
          }
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
          size="sm"
          onClick={() =>
            handleFilters("statut", DemandeStatutEnum["projet de demande"])
          }
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>
              {countDemandes?.["projet de demande"]}
            </Text>
          }
        >
          <Text
            fontWeight={
              isRecapView && statut === DemandeStatutEnum["projet de demande"]
                ? "bold"
                : "normal"
            }
          >
            Projets de demandes
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          size="sm"
          onClick={() => handleFilters("statut", DemandeStatutEnum["refusée"])}
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
      </VStack>
    </Flex>
  );
};
