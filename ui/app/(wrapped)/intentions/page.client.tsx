"use client";

import { LinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useState } from "react";
import { ApiType } from "shared";

import { api } from "../../../api.client";
import { OrderIcon } from "../../../components/OrderIcon";
import { TableFooter } from "../../../components/TableFooter";
import { createParametrizedUrl } from "../../../utils/createParametrizedUrl";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuIntention } from "./menuIntention/MenuIntention";
import { typeDemandesOptions } from "./utils/typeDemandeUtils";

export type Query = Parameters<typeof api.getDemandes>[0]["query"];
export type Filters = Pick<Query, "status">;
export type Order = Pick<Query, "order" | "orderBy">;

const PAGE_SIZE = 30;
const fetchDemandes = async (query: Query) => api.getDemandes({ query }).call();

export const PageClient = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString());

  const setSearchParams = (params: {
    filters?: typeof filters;
    order?: typeof order;
    page?: typeof page;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const trackEvent = usePlausible();

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("demandes:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({ order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;

  const { data, isLoading } = useQuery({
    keepPreviousData: true,
    staleTime: 0,
    queryKey: ["demandes", filters, order, page],
    queryFn: () =>
      fetchDemandes({
        ...filters,
        ...order,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
  });

  const nouvelleCompensation = (
    demandeCompensee: ApiType<typeof api.getDemandes>["demandes"][0]
  ) => {
    router.push(
      createParametrizedUrl(`${location.pathname}/new`, {
        intentionId: demandeCompensee.id,
        compensation: true,
      })
    );
  };

  const [selectedRow, setSelectedRow] = useState("");

  if (isLoading) return <IntentionSpinner />;
  return (
    <Container maxW={"95%"} my={12}>
      <Grid templateColumns="repeat(5,1fr)" gap={2}>
        <GridItem>
          <MenuIntention isRecapView></MenuIntention>
        </GridItem>
        <GridItem colSpan={4}>
          {data?.demandes.length ? (
            <TableContainer overflow="auto">
              <Table variant="striped" fontSize="14px" gap="0">
                <Thead>
                  <Tr>
                    <Th px={"12px"}>n° demande</Th>
                    <Th
                      px={"12px"}
                      cursor="pointer"
                      onClick={() => handleOrder("libelleDiplome")}
                    >
                      <OrderIcon {...order} column="libelleDiplome" />
                      diplôme
                    </Th>
                    <Th
                      px={"12px"}
                      cursor="pointer"
                      onClick={() => handleOrder("typeDemande")}
                    >
                      <OrderIcon {...order} column="typeDemande" />
                      type
                    </Th>
                    <Th px={"12px"}>compensation</Th>
                    <Th
                      px={"12px"}
                      cursor="pointer"
                      isNumeric
                      onClick={() => handleOrder("createdAt")}
                    >
                      <OrderIcon {...order} column="createdAt" />
                      création
                    </Th>
                    <Th
                      px={"12px"}
                      cursor="pointer"
                      onClick={() => handleOrder("status")}
                    >
                      <OrderIcon {...order} column="status" />
                      status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.demandes.map((demande) => {
                    const bgColor =
                      demande.id === selectedRow
                        ? "bluefrance.525_active !important"
                        : "inherit";
                    return (
                      <Tr
                        display="table-row"
                        key={demande.id}
                        cursor="pointer"
                        height={"80px"}
                        whiteSpace={"pre"}
                        bg={bgColor}
                        onClick={() => {
                          router.push(`/intentions/${demande.id}`);
                        }}
                      >
                        <Td
                          maxW={"36"}
                          textOverflow={"ellipsis"}
                          isTruncated
                          px={"12px"}
                          bg={bgColor}
                        >
                          {demande.id}
                        </Td>
                        <Td w="lg" px={"12px"} bg={bgColor}>
                          <Text
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"break-spaces"}
                            noOfLines={2}
                          >
                            {demande.libelleDiplome}
                          </Text>
                        </Td>
                        <Td w="xs" px={"12px"} bg={bgColor}>
                          <Text
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"break-spaces"}
                            noOfLines={2}
                          >
                            {demande.typeDemande
                              ? typeDemandesOptions[demande.typeDemande].label
                              : null}
                          </Text>
                        </Td>
                        <Td w="44" px={"12px"} bg={bgColor}>
                          {demande.compensationCfd != null &&
                          demande.compensationDispositifId != null &&
                          demande.compensationUai != null ? (
                            demande.idCompensation != undefined ? (
                              <Tag
                                as={Button}
                                color={"green.700"}
                                bg={"unset"}
                                border={"none"}
                                size={"sm"}
                                minW="44"
                                overflow={"hidden"}
                                whiteSpace={"break-spaces"}
                                noOfLines={2}
                                leftIcon={<LinkIcon focusable={true} />}
                                disabled={true}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    createParametrizedUrl(
                                      `/intentions/${demande.idCompensation}`,
                                      {
                                        compensation: true,
                                      }
                                    )
                                  );
                                }}
                                onMouseEnter={() =>
                                  setSelectedRow(demande.idCompensation ?? "")
                                }
                                onMouseLeave={() => setSelectedRow("")}
                              >
                                {`${
                                  demande.typeCompensation
                                    ? typeDemandesOptions[
                                        demande.typeCompensation
                                      ].label
                                    : "Demande"
                                } liée `}
                                <Text textDecoration="underline">
                                  {demande.idCompensation}
                                </Text>
                              </Tag>
                            ) : (
                              <Tag
                                as={Button}
                                variant={"outline"}
                                colorScheme={"orange"}
                                size={"sm"}
                                minW="44"
                                overflow={"hidden"}
                                whiteSpace={"break-spaces"}
                                noOfLines={2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nouvelleCompensation(demande);
                                }}
                              >
                                Aucune demande liée identifiée
                              </Tag>
                            )
                          ) : null}
                        </Td>
                        <Td isNumeric px={"12px"} bg={bgColor}>
                          {new Date(demande.createdAt).toLocaleDateString()}
                        </Td>
                        <Td align="center" px={"12px"} bg={bgColor}>
                          {demande.status === "draft" ? (
                            <Tag
                              colorScheme={"orange"}
                              size={"md"}
                              minW="100%"
                              justifyContent={"center"}
                            >
                              Brouillon
                            </Tag>
                          ) : (
                            <Tag
                              colorScheme={"green"}
                              size={"md"}
                              minW="100%"
                              justifyContent={"center"}
                            >
                              Validée
                            </Tag>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              <TableFooter
                onExport={() => trackEvent("demandes:export")}
                downloadLink={
                  api.getDemandesCsv({
                    query: { ...filters, ...order },
                  }).url
                }
                page={page}
                pageSize={PAGE_SIZE}
                count={data?.count}
                onPageChange={(newPage) => setSearchParams({ page: newPage })}
              />
            </TableContainer>
          ) : (
            <Center mt={12}>
              <Flex flexDirection={"column"}>
                <Text fontSize={"2xl"}>Pas encore de demande à afficher</Text>
                <Button
                  variant="createButton"
                  size={"lg"}
                  as={NextLink}
                  href="/intentions/new"
                  px={3}
                  mt={12}
                  mx={"auto"}
                >
                  Nouvelle demande
                </Button>
              </Flex>
            </Center>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
};
