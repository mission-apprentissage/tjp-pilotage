import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Button, Flex, Select, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { client } from "@/api.client";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { Campagnes, Filters } from "../types";

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
  const campagne = searchParams.campagne;

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
        isDisabled={!hasPermissionEnvoi}
        mb="4"
        variant="createButton"
        size={"md"}
        width={"100%"}
        as={hasPermissionEnvoi ? NextLink : undefined}
        href="/intentions/saisie/new"
      >
        Nouvelle demande
      </Button>
      <Flex direction={"column"} gap={1}>
        <Text>Sélectionner une campagne</Text>
        <Select
          value={campagne ?? CURRENT_ANNEE_CAMPAGNE}
          onChange={(event) =>
            setSearchParams({
              ...searchParams,
              campagne: event.target.value,
            })
          }
        >
          {campagnes?.map((campagne) => (
            <option value={campagne.annee} key={campagne.annee}>
              {`${campagne.annee} (${
                campagne.statut.charAt(0).toUpperCase() +
                campagne.statut.substr(1)
              })`}
            </option>
          ))}
        </Select>
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
