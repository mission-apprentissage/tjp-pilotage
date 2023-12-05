import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import qs from "qs";

import { client } from "../../../../../api.client";

export type Query = (typeof client.inferArgs)["[GET]/demandes"]["query"];
export type Filters = Pick<Query, "status">;

export const MenuIntention = ({
  isRecapView = false,
  hasPermissionEnvoi,
}: {
  isRecapView?: boolean;
  hasPermissionEnvoi: boolean;
}) => {
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
  } = qs.parse(queryParams.toString());

  const status =
    searchParams.filters === undefined ? "none" : searchParams.filters?.status;

  const { data: countDemandes } = client.ref("[GET]/demandes/count").useQuery(
    {},
    {
      keepPreviousData: true,
      staleTime: 0,
    }
  );

  return (
    <Flex direction="column" pr={4} minW={250}>
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
      <VStack flex="1" align="flex-start" spacing={2}>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href="/intentions/saisie"
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={<Text fontWeight={"normal"}>{countDemandes?.total}</Text>}
        >
          <Text
            fontWeight={isRecapView && status === "none" ? "bold" : "normal"}
          >
            Toutes
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href="/intentions/saisie?filters[status]=submitted"
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>{countDemandes?.submitted}</Text>
          }
        >
          <Text
            fontWeight={
              isRecapView && status === "submitted" ? "bold" : "normal"
            }
          >
            Demandes validées
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href="/intentions/saisie?filters[status]=draft"
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={<Text fontWeight={"normal"}>{countDemandes?.draft}</Text>}
        >
          <Text
            fontWeight={isRecapView && status === "draft" ? "bold" : "normal"}
          >
            Projets de demandes
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href="/intentions/saisie?filters[status]=refused"
          width={"100%"}
          iconSpacing={"auto"}
          rightIcon={
            <Text fontWeight={"normal"}>{countDemandes?.refused}</Text>
          }
        >
          <Text
            fontWeight={isRecapView && status === "refused" ? "bold" : "normal"}
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
