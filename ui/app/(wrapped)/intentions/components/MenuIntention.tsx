import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import qs from "qs";

import { api } from "../../../../api.client";

export type Query = Parameters<typeof api.getDemandes>[0]["query"];
export type Filters = Pick<Query, "status">;
const fetchCountDemandes = async () => api.countDemandes({}).call();

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
    searchParams.filters === undefined
      ? "none"
      : searchParams.filters?.status
      ? searchParams.filters?.status[0]
      : "";

  const { data: countDemandes } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["countDemandes"],
    queryFn: fetchCountDemandes,
  });

  return (
    <Flex direction="column" pr={4} minW={250}>
      <Button
        isDisabled={!hasPermissionEnvoi}
        mb="4"
        variant="createButton"
        size={"md"}
        width={"100%"}
        as={hasPermissionEnvoi ? NextLink : undefined}
        href="/intentions/new"
      >
        Nouvelle demande
      </Button>
      <VStack flex="1" align="flex-start" spacing={2}>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size="sm"
          href="/intentions"
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
          href="/intentions?filters[status][0]=submitted"
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
          href="/intentions?filters[status][0]=draft"
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
          variant="ghost"
          mb="2"
          as={NextLink}
          size="sm"
          mt="auto"
          href="/intentions/documentation"
          width={"100%"}
          leftIcon={<QuestionOutlineIcon />}
        >
          Documentation
        </Button>
      </VStack>
    </Flex>
  );
};
