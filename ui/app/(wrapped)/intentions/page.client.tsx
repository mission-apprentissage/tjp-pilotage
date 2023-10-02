"use client";

import { LinkIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
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
import { ApiType } from "shared";

import { usePermission } from "@/utils/security/usePermission";

import { api } from "../../../api.client";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { OrderIcon } from "../../../components/OrderIcon";
import { TableFooter } from "../../../components/TableFooter";
import { createParametrizedUrl } from "../../../utils/createParametrizedUrl";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuIntention } from "./components/MenuIntention";
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

  const hasPermissionEnvoi = usePermission("intentions/ecriture");

  if (isLoading) return <IntentionSpinner />;

  return (
    <>
      <Container maxW="container.xl" py="4">
        <Breadcrumb
          ml={4}
          pages={[
            { title: "Accueil", to: "/" },
            { title: "Recueil des demandes", to: "/intentions", active: true },
          ]}
        />
      </Container>
      <Container maxWidth="100%" flex={1} display={"flex"} minHeight={0}>
        <MenuIntention hasPermissionEnvoi={hasPermissionEnvoi} isRecapView />
        <Box borderLeft="solid 1px" borderColor="gray.100" height="100%" />
        <Flex flex={1} flexDirection="column" overflow="hidden" minHeight={0}>
          {data?.demandes.length ? (
            <>
              <TableContainer overflowY="auto" flex={1}>
                <Table
                  sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }}
                  size="md"
                  variant="striped"
                  fontSize="14px"
                  gap="0"
                >
                  <Thead
                    position="sticky"
                    zIndex={1}
                    top="0"
                    boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
                    bg="white"
                  >
                    <Tr>
                      <Th>n° demande</Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("libelleDiplome")}
                      >
                        <OrderIcon {...order} column="libelleDiplome" />
                        diplôme
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("typeDemande")}
                      >
                        <OrderIcon {...order} column="typeDemande" />
                        type
                      </Th>
                      <Th>compensation</Th>

                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("status")}
                      >
                        <OrderIcon {...order} column="status" />
                        status
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("createdAt")}
                      >
                        <OrderIcon {...order} column="createdAt" />
                        Date de création
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.demandes.map((demande) => {
                      return (
                        <Tr
                          height={"60px"}
                          key={demande.id}
                          cursor="pointer"
                          whiteSpace={"pre"}
                          onClick={() =>
                            router.push(`/intentions/${demande.id}`)
                          }
                        >
                          <Td>{demande.id}</Td>
                          <Td>
                            <Text
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"break-spaces"}
                              noOfLines={2}
                            >
                              {demande.libelleDiplome}
                            </Text>
                          </Td>
                          <Td>
                            {demande.typeDemande
                              ? typeDemandesOptions[demande.typeDemande].label
                              : null}
                          </Td>
                          <Td>
                            {demande.compensationCfd &&
                            demande.compensationDispositifId &&
                            demande.compensationUai ? (
                              demande.idCompensation ? (
                                <Button
                                  _hover={{ bg: "gray.200" }}
                                  variant="ghost"
                                  whiteSpace={"break-spaces"}
                                  size="xs"
                                  py="2"
                                  height="auto"
                                  fontWeight="normal"
                                  leftIcon={<LinkIcon focusable={true} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/intentions/${demande.idCompensation}?compensation=true`
                                    );
                                  }}
                                >
                                  <Box textAlign="left">
                                    <Box whiteSpace="nowrap">
                                      {`${
                                        demande.typeCompensation
                                          ? typeDemandesOptions[
                                              demande.typeCompensation
                                            ].label
                                          : "Demande"
                                      } liée `}
                                    </Box>
                                    <Text textDecoration="underline">
                                      {demande.idCompensation}
                                    </Text>
                                  </Box>
                                </Button>
                              ) : (
                                <Button
                                  _hover={{ bg: "gray.200" }}
                                  variant="ghost"
                                  whiteSpace={"break-spaces"}
                                  size="xs"
                                  py="2"
                                  height="auto"
                                  fontWeight="normal"
                                  color="red.500"
                                  leftIcon={<WarningTwoIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nouvelleCompensation(demande);
                                  }}
                                >
                                  <Box textAlign="left" whiteSpace="nowrap">
                                    Aucune demande liée <br /> identifiée
                                  </Box>
                                </Button>
                              )
                            ) : (
                              <></>
                            )}
                          </Td>
                          <Td align="center" w={0}>
                            {demande.status === "draft" ? (
                              <Tag size="sm" colorScheme={"orange"}>
                                Projet de demande
                              </Tag>
                            ) : (
                              <Tag size="sm" colorScheme={"green"}>
                                Demande validée
                              </Tag>
                            )}
                          </Td>
                          <Td>
                            {new Date(demande.createdAt).toLocaleString()}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
              <TableFooter
                pl="4"
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
            </>
          ) : (
            <Center mt={12}>
              <Flex flexDirection={"column"}>
                <Text fontSize={"2xl"}>Pas encore de demande à afficher</Text>
                {hasPermissionEnvoi && (
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
                )}
              </Flex>
            </Center>
          )}
        </Flex>
      </Container>
    </>
  );
};
