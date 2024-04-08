import { ChevronDownIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import _ from "lodash";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { client } from "@/api.client";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { Campagnes, Filters } from "../types";
import { isSaisieDisabled } from "../utils/isSaisieDisabled";

const CampagneStatutTag = ({ statut }: { statut?: string }) => {
  switch (statut) {
    case "en cours":
      return (
        <Tag size="md" colorScheme={"green"} ml={2}>
          {statut}
        </Tag>
      );
    case "en attente":
      return (
        <Tag size="md" colorScheme={"purple"} ml={2}>
          {statut}
        </Tag>
      );
    case "terminée":
      return (
        <Tag size="md" colorScheme={"red"} ml={2}>
          {statut}
        </Tag>
      );
    default:
      return (
        <Tag size="md" colorScheme={"yellow"} ml={2}>
          {statut}
        </Tag>
      );
  }
};

export const MenuIntention = ({
  isRecapView = false,
  hasPermissionEnvoi,
  campagnes,
}: {
  isRecapView?: boolean;
  hasPermissionEnvoi: boolean;
  campagnes?: Campagnes;
}) => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    campagne?: string;
  } = qs.parse(queryParams.toString());

  const statut =
    searchParams.filters === undefined ? "none" : searchParams.filters?.statut;
  const campagne = searchParams.campagne ?? CURRENT_ANNEE_CAMPAGNE;

  const setSearchParams = (params: {
    filters?: Partial<Filters>;
    campagne?: string;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, {
        ...searchParams,
        ...params,
      })
    );
  };

  const { data: countDemandes } = client.ref("[GET]/demandes/count").useQuery(
    {
      query: {
        campagne,
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
        isDisabled={!hasPermissionEnvoi || isSaisieDisabled()}
        mb="4"
        variant="createButton"
        size={"md"}
        width={"100%"}
        as={hasPermissionEnvoi && !isSaisieDisabled() ? NextLink : undefined}
        href="/intentions/saisie/new"
      >
        Nouvelle demande
      </Button>
      <Flex direction={"column"} gap={1}>
        <Text>Sélectionner une campagne</Text>
        <Menu gutter={0} matchWidth={true} autoSelect={false}>
          <MenuButton
            as={Button}
            variant={"selectButton"}
            rightIcon={<ChevronDownIcon />}
            w={"100%"}
          >
            <Flex direction="row">
              <Text my={"auto"}>
                Campagne{" "}
                {campagnes?.find((c) => c.annee === campagne)?.annee ?? ""}
              </Text>
              <CampagneStatutTag
                statut={campagnes?.find((c) => c.annee === campagne)?.statut}
              />
            </Flex>
          </MenuButton>
          <MenuList py={0} borderTopRadius={0}>
            {campagnes?.map((campagne) => (
              <MenuItem
                p={2}
                key={campagne.annee}
                onClick={() => {
                  setSearchParams({
                    ...searchParams,
                    campagne: campagne.annee,
                  });
                }}
              >
                <Flex direction="row">
                  <Text my={"auto"}>Campagne {campagne.annee}</Text>
                  <CampagneStatutTag statut={campagne.statut} />
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
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
              statut: "submitted",
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>{countDemandes?.submitted}</Text>
          }
        >
          <Text
            fontWeight={
              isRecapView && statut === "submitted" ? "bold" : "normal"
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
              statut: "draft",
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={<Text fontWeight={"normal"}>{countDemandes?.draft}</Text>}
        >
          <Text
            fontWeight={isRecapView && statut === "draft" ? "bold" : "normal"}
          >
            Projets de demandes
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
              statut: "refused",
            },
          })}
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>{countDemandes?.refused}</Text>
          }
        >
          <Text
            fontWeight={isRecapView && statut === "refused" ? "bold" : "normal"}
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
          href="/intentions/saisie/documentation"
          width={"100%"}
          leftIcon={<QuestionOutlineIcon />}
        >
          Documentation
        </Button>
      </VStack>
    </Flex>
  );
};
