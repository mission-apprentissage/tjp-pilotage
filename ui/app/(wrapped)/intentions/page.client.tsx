"use client";

import {
  Center,
  Container,
  Grid,
  GridItem,
  Spinner,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";

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

  if (isLoading) {
    return (
      <Center mt={12}>
        <Spinner />
      </Center>
    );
  }

  return (
    <Container maxW={"container.xl"} my={12}>
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
                    libelle
                  </Th>
                  <Th cursor="pointer" onClick={() => handleOrder("cfd")}>
                    <OrderIcon {...order} column="cfd" />
                    CFD
                  </Th>
                  <Th cursor="pointer" onClick={() => handleOrder("uai")}>
                    <OrderIcon {...order} column="uai" />
                    UAI
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
                </Tr>
              </Thead>
              <Tbody>
                {data?.demandes.map((demande) => (
                  <Tr
                    display="table-row"
                    as={Link}
                    key={demande.id}
                    href={`/intentions/${demande.id}`}
                  >
                    <Td maxWidth={20} whiteSpace="nowrap">
                      {" "}
                      {demande.id.substring(5, 11)}...{" "}
                    </Td>
                    <Td> {demande.libelleDiplome} </Td>
                    <Td>{demande.cfd}</Td>
                    <Td>{demande.uai}</Td>
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
