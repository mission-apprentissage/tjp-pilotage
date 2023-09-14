import { Button, Container, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import qs from "qs";

import { api } from "../../../../api.client";

export type Query = Parameters<typeof api.getDemandes>[0]["query"];
export type Filters = Pick<Query, "status">;

export const MenuIntention = () => {
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
  } = qs.parse(queryParams.toString());

  const status = searchParams.filters?.status
    ? searchParams.filters?.status[0]
    : "";

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
          me={"auto"}
        >
          Nouvelle demande
        </Button>
        <Button
          mt={5}
          bgColor={"unset"}
          fontWeight={status === "draft" ? "bold" : "normal"}
          as={NextLink}
          size={"lg"}
          href="/intentions?filters[status][0]=draft"
          me={"auto"}
        >
          Brouillons
        </Button>
        <Button
          bgColor={"unset"}
          fontWeight={status === "submitted" ? "bold" : "normal"}
          as={NextLink}
          size={"lg"}
          href="/intentions?filters[status][0]=submitted"
          me={"auto"}
        >
          Validées
        </Button>
      </VStack>
    </Container>
  );
};
