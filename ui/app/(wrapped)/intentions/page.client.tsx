"use client";

import { LinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Spinner,
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
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { ApiType } from "shared";

import { api } from "../../../api.client";
import { OrderIcon } from "../../../components/OrderIcon";
import { TableFooter } from "../../../components/TableFooter";
import { createParametrizedUrl } from "../../../utils/createParametrizedUrl";
import { MenuIntention } from "./menuIntention/MenuIntention";

export type Query = Parameters<typeof api.getDemandes>[0]["query"];
export type Filters = Pick<Query, "status">;
export type Order = Pick<Query, "order" | "orderBy">;

const PAGE_SIZE = 30;
const fetchDemandes = async (query: Query) => api.getDemandes({ query }).call();

const TYPE_DEMANDE_MAPPING: Record<string, string> = {
  ouverture_nette: "Ouverture nette",
  ouverture_compensation: "Oouverture par compensation",
  augmentation: "Augmentation",
  augmentation_compensation: "Augmentation par compensation",
  fermeture: "Fermeture",
  diminution: "Diminiution",
};

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
        values: {
          cfd: demandeCompensee.compensationCfd,
          dispositifId: demandeCompensee.compensationDispositifId,
          uai: demandeCompensee.compensationUai,
          rentreeScolaire: demandeCompensee.compensationRentreeScolaire,
        },
        metadata: {
          formation: demandeCompensee.metadata?.formationCompensation,
          etablissement: demandeCompensee.metadata?.etablissementCompensation,
        },
      })
    );
  };

  if (isLoading) {
    return (
      <Center mt={12}>
        <Spinner />
      </Center>
    );
  }

  return (
    <Container maxW={"80%"} my={12}>
      <Grid templateColumns="repeat(5,1fr)" gap={2}>
        <GridItem>
          <MenuIntention isRecapView></MenuIntention>
        </GridItem>
        <GridItem colSpan={4}>
          <TableContainer overflow="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>id</Th>
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
                  <Th cursor="pointer" onClick={() => handleOrder("status")}>
                    <OrderIcon {...order} column="status" />
                    status
                  </Th>
                  <Th
                    cursor="pointer"
                    isNumeric
                    onClick={() => handleOrder("createdAt")}
                  >
                    <OrderIcon {...order} column="createdAt" />
                    création
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.demandes.map((demande) => (
                  <Tr
                    key={demande.id}
                    cursor="pointer"
                    height={"80px"}
                    whiteSpace={"pre"}
                    // onClick={() => {
                    //   router.push(`/intentions/${demande.id}`);
                    // }}
                  >
                    <Td maxW={"100px"} textOverflow={"ellipsis"} isTruncated>
                      {demande.id}
                    </Td>
                    <Td w="sm">
                      <Text
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        whiteSpace={"break-spaces"}
                        noOfLines={2}
                      >
                        {demande.libelleDiplome}
                      </Text>
                    </Td>
                    <Td w="sm">
                      <Text
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        whiteSpace={"break-spaces"}
                        noOfLines={2}
                      >
                        {demande.typeDemande
                          ? TYPE_DEMANDE_MAPPING[demande.typeDemande]
                          : null}
                      </Text>
                    </Td>
                    <Td align="center">
                      {demande.status === "draft" ? (
                        <Tag
                          colorScheme={"orange"}
                          size={"lg"}
                          minW="100%"
                          justifyContent={"center"}
                        >
                          Brouillon
                        </Tag>
                      ) : (
                        <Tag
                          colorScheme={"green"}
                          size={"lg"}
                          minW="100%"
                          justifyContent={"center"}
                        >
                          Validée
                        </Tag>
                      )}
                    </Td>
                    <Td isNumeric>
                      {new Date(demande.createdAt).toLocaleDateString()}
                    </Td>
                    <Td align="center" w="sm">
                      {demande.compensationCfd != null &&
                      demande.compensationDispositifId != null &&
                      demande.compensationUai != null ? (
                        demande.estCompensee === false ? (
                          <Tag
                            as={Button}
                            colorScheme={"orange"}
                            size={"lg"}
                            justifyContent={"center"}
                            overflow={"hidden"}
                            whiteSpace={"break-spaces"}
                            noOfLines={2}
                            onClick={(e) => {
                              e.preventDefault();
                              nouvelleCompensation(demande);
                            }}
                            zIndex={2}
                          >
                            <Flex
                              flexDirection={"row"}
                              justifyContent={"space-evenly"}
                              alignItems={"center"}
                            >
                              <Text maxWidth="60%">
                                En attente de compensation
                              </Text>
                              <LinkIcon boxSize={"1.5em"} focusable={true} />
                            </Flex>
                          </Tag>
                        ) : (
                          <Tag
                            colorScheme={"green"}
                            size={"lg"}
                            minW="100%"
                            justifyContent={"center"}
                          >
                            Compensée
                          </Tag>
                        )
                      ) : null}
                    </Td>
                  </Tr>
                ))}
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
        </GridItem>
      </Grid>
    </Container>
  );
};
