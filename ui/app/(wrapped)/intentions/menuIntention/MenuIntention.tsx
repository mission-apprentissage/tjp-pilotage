import { Button, Container, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import qs from "qs";

import { api } from "../../../../api.client";

export type Query = Parameters<typeof api.getDemandes>[0]["query"];
export type Filters = Pick<Query, "status">;
const fetchCountDemandes = async (query: Query) =>
  api.countDemandes({ query }).call();

export const MenuIntention = ({
  isRecapView = false,
}: {
  isRecapView?: boolean;
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

  const { data: countAll } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["countAll"],
    queryFn: () => fetchCountDemandes({}),
  });

  const { data: countDraft } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["countDraft"],
    queryFn: () => fetchCountDemandes({ status: "draft" }),
  });

  const { data: countSubmitted } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["countSubmitted"],
    queryFn: () => fetchCountDemandes({ status: "submitted" }),
  });

  return (
    <Container mb={"auto"} px={4}>
      <VStack>
        <Button
          variant="primary"
          borderRadius={5}
          bgColor={"#5770BE"}
          color={"white"}
          size={"lg"}
          as={NextLink}
          href="/intentions/new"
          px={3}
          mx={"auto"}
        >
          Nouvelle demande
        </Button>
        <Button
          mt={5}
          bgColor={"unset"}
          as={NextLink}
          size={"lg"}
          href="/intentions"
          me={"auto"}
          fontWeight={"normal"}
          width={"100%"}
          borderRadius={"0 12px 12px 0"}
          px={3}
          iconSpacing={"auto"}
          rightIcon={<Text fontSize={"14"}>{countAll}</Text>}
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
          size={"lg"}
          href="/intentions?filters[status][0]=draft"
          me={"auto"}
          fontWeight={"normal"}
          width={"100%"}
          borderRadius={"0 12px 12px 0"}
          px={3}
          iconSpacing={"auto"}
          rightIcon={<Text fontSize={"14"}>{countDraft}</Text>}
        >
          <Text
            fontWeight={isRecapView && status === "draft" ? "bold" : "normal"}
          >
            Brouillons
          </Text>
        </Button>
        <Button
          bgColor={"unset"}
          as={NextLink}
          size={"lg"}
          href="/intentions?filters[status][0]=submitted"
          me={"auto"}
          fontWeight={"normal"}
          width={"100%"}
          borderRadius={"0 12px 12px 0"}
          px={3}
          iconSpacing={"auto"}
          rightIcon={<Text fontSize={"14"}>{countSubmitted}</Text>}
        >
          <Text
            fontWeight={
              isRecapView && status === "submitted" ? "bold" : "normal"
            }
          >
            Validées
          </Text>
        </Button>
      </VStack>
    </Container>
  );
};
