"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
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
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useState } from "react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { isSaisieDisabled } from "@/app/(wrapped)/intentions/saisie/utils/isSaisieDisabled";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { usePermission } from "@/utils/security/usePermission";

import { getTypeDemandeLabel } from "../utils/typeDemandeUtils";
import { Header } from "./components/Header";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuIntention } from "./components/MenuIntention";
import { DEMANDES_COLUMNS } from "./DEMANDES_COLUMNS";
import { Filters, Order } from "./types";

const PAGE_SIZE = 30;

const TagDemande = ({ statut }: { statut: string }) => {
  switch (statut) {
    case DemandeStatutEnum.draft:
      return (
        <Tag size="sm" colorScheme={"orange"}>
          Projet de demande
        </Tag>
      );
    case DemandeStatutEnum.submitted:
      return (
        <Tag size="sm" colorScheme={"green"}>
          Demande validée
        </Tag>
      );
    case DemandeStatutEnum.refused:
      return (
        <Tag size="sm" colorScheme={"red"}>
          Demande refusée
        </Tag>
      );
    default:
      return <></>;
  }
};

export const PageClient = () => {
  const toast = useToast();
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    order?: Partial<Order>;
    page?: string;
    campagne?: string;
    action?: "draft" | "submitted" | "refused";
  } = qs.parse(queryParams.toString());

  const filters = searchParams.filters ?? {};
  const search = searchParams.search ?? "";
  const order = searchParams.order ?? { order: "asc" };
  const campagne = searchParams.campagne;
  const page = searchParams.page ? parseInt(searchParams.page) : 0;

  const setSearchParams = (params: {
    filters?: typeof filters;
    search?: typeof search;
    order?: typeof order;
    page?: typeof page;
    campagne?: typeof campagne;
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

  const getDemandesQueryParameters = (qLimit: number, qOffset?: number) => ({
    ...filters,
    search,
    ...order,
    offset: qOffset,
    limit: qLimit,
    campagne,
  });

  const { data, isLoading } = client.ref("[GET]/demandes").useQuery(
    {
      query: getDemandesQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    { keepPreviousData: true, staleTime: 0 }
  );

  const hasPermissionEnvoi = usePermission("intentions/ecriture");

  const [searchDemande, setSearchDemande] = useState<string>(search);

  const getAvatarBgColor = (userName: string) => {
    const colors = [
      "#958b62",
      "#91ae4f",
      "#169b62",
      "#466964",
      "#00Ac8c",
      "#5770be",
      "#484d7a",
      "#ff8d7e",
      "#ffc29e",
      "#ffe800",
      "#fdcf41",
      "#ff9940",
      "#e18b63",
      "#ff6f4c",
      "#8586F6",
    ];
    return colors[userName.charCodeAt(1) % colors.length];
  };

  const { mutateAsync: importDemande } = client
    .ref("[POST]/demande/import/:numero")
    .useMutation({
      onSuccess: (demande) => {
        router.push(`/intentions/saisie/${demande.numero}`);
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: error.message,
        });
      },
    });

  if (isLoading) return <IntentionSpinner />;

  return (
    <>
      <Container
        maxWidth="100%"
        flex={1}
        flexDirection={["column", null, "row"]}
        display={"flex"}
        minHeight={0}
        py={4}
      >
        <MenuIntention
          hasPermissionEnvoi={hasPermissionEnvoi}
          isRecapView
          campagne={data?.campagne}
        />
        <Box
          display={["none", null, "unset"]}
          borderLeft="solid 1px"
          borderColor="gray.100"
          height="100%"
          mr={4}
        />
        <Flex
          flex={1}
          flexDirection="column"
          overflow="visible"
          minHeight={0}
          minW={0}
        >
          <Header
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            getDemandesQueryParameters={getDemandesQueryParameters}
            searchDemande={searchDemande}
            setSearchDemande={setSearchDemande}
            campagnes={data?.campagnes}
            campagne={data?.campagne}
          />
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
                    top="0"
                    boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
                    bg="white"
                  >
                    <Tr>
                      <Th>n° demande</Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("libelleFormation")}
                      >
                        <OrderIcon {...order} column="libelleFormation" />
                        {DEMANDES_COLUMNS.libelleFormation}
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("libelleEtablissement")}
                      >
                        <OrderIcon {...order} column="libelleEtablissement" />
                        {DEMANDES_COLUMNS.libelleEtablissement}
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("libelleDepartement")}
                      >
                        <OrderIcon {...order} column="libelleDepartement" />
                        {DEMANDES_COLUMNS.libelleDepartement}
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("typeDemande")}
                      >
                        <OrderIcon {...order} column="typeDemande" />
                        {DEMANDES_COLUMNS.typeDemande}
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("statut")}
                      >
                        <OrderIcon {...order} column="statut" />
                        {DEMANDES_COLUMNS.statut}
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("createdAt")}
                      >
                        <OrderIcon {...order} column="createdAt" />
                        {DEMANDES_COLUMNS.createdAt}
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("userName")}
                        w="15"
                      >
                        <OrderIcon {...order} column="userName" />
                        {DEMANDES_COLUMNS.userName}
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("updatedAt")}
                      >
                        <OrderIcon {...order} column="updatedAt" />
                        {DEMANDES_COLUMNS.updatedAt}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.demandes.map(
                      (
                        demande: (typeof client.infer)["[GET]/demandes"]["demandes"][0]
                      ) => (
                        <Tr
                          height={"60px"}
                          key={demande.numero}
                          cursor={isSaisieDisabled() ? "initial" : "pointer"}
                          whiteSpace={"pre"}
                          onClick={() => {
                            if (isSaisieDisabled()) return;
                            router.push(`/intentions/saisie/${demande.numero}`);
                          }}
                        >
                          <Td>{demande.numero}</Td>
                          <Td>
                            <Text
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"break-spaces"}
                              noOfLines={2}
                            >
                              {demande.libelleFormation}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"break-spaces"}
                              noOfLines={2}
                            >
                              {demande.libelleEtablissement}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"break-spaces"}
                              noOfLines={2}
                            >
                              {demande.libelleDepartement}
                            </Text>
                          </Td>
                          <Td>
                            <Text
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"break-spaces"}
                              noOfLines={2}
                            >
                              {demande.typeDemande
                                ? getTypeDemandeLabel(demande.typeDemande)
                                : null}
                            </Text>
                          </Td>
                          <Td align="center" w={0}>
                            <TagDemande statut={demande.statut} />
                          </Td>
                          <Td>
                            {new Date(demande.createdAt).toLocaleString()}
                          </Td>
                          <Td w="15" textAlign={"center"}>
                            <Tooltip label={demande.userName}>
                              <Avatar
                                name={demande.userName}
                                colorScheme={getAvatarBgColor(
                                  demande.userName ?? ""
                                )}
                                bg={getAvatarBgColor(demande.userName ?? "")}
                                color={"white"}
                                position={"unset"}
                              />
                            </Tooltip>
                          </Td>
                          <Td textAlign={"center"}>
                            {new Date(demande.updatedAt).toLocaleString()}
                          </Td>
                          {data?.campagne.statut ===
                            CampagneStatutEnum["terminée"] && (
                            <Td>
                              {demande.numeroDemandeImportee ? (
                                <Button
                                  as={NextLink}
                                  variant="link"
                                  href={`/intentions/saisie/${demande.numeroDemandeImportee}`}
                                  leftIcon={<ExternalLinkIcon />}
                                  me={"auto"}
                                >
                                  Demande dupliquée{" "}
                                  {demande.numeroDemandeImportee}
                                </Button>
                              ) : (
                                <Button
                                  leftIcon={<Icon icon="ri:import-line" />}
                                  variant={"newInput"}
                                  onClick={(e) => {
                                    if (demande.numeroDemandeImportee) return;
                                    e.preventDefault();
                                    e.stopPropagation();
                                    importDemande({
                                      params: { numero: demande.numero },
                                    });
                                  }}
                                  isDisabled={!!demande.numeroDemandeImportee}
                                >
                                  Dupliquer cette demande
                                </Button>
                              )}
                            </Td>
                          )}
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              <TableFooter
                pl="4"
                page={page}
                pageSize={PAGE_SIZE}
                count={data?.count}
                onPageChange={(newPage) => setSearchParams({ page: newPage })}
              />
            </>
          ) : (
            <Center mt={12}>
              <Flex flexDirection={"column"}>
                <Text fontSize={"2xl"}>Pas de demande à afficher</Text>
                {hasPermissionEnvoi && (
                  <Button
                    isDisabled={isSaisieDisabled()}
                    variant="createButton"
                    size={"lg"}
                    as={!isSaisieDisabled() ? NextLink : undefined}
                    href="/intentions/saisie/new"
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
