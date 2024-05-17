"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
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
  useToken,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useState } from "react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { OrderIcon } from "@/components/OrderIcon";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { formatDate } from "@/utils/formatDate";
import { usePermission } from "@/utils/security/usePermission";

import { formatStatut } from "../../utils/statutUtils";
import { getTypeDemandeLabel } from "../../utils/typeDemandeUtils";
import { Header } from "./components/Header";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuIntention } from "./components/MenuIntention";
import { INTENTIONS_COLUMNS } from "./INTENTIONS_COLUMNS";
import { Filters, Order } from "./types";
import { isSaisieDisabled } from "./utils/isSaisieDisabled";

const PAGE_SIZE = 30;

const TagDemande = ({ statut }: { statut: DemandeStatutType }) => {
  const getColorStatut = (statut: DemandeStatutType) => {
    if (statut === DemandeStatutEnum["proposition"]) return "pink";
    if (statut === DemandeStatutEnum["brouillon"]) return "orange";
    if (statut === DemandeStatutEnum["demande validée"]) return "green";
    if (statut === DemandeStatutEnum["refusée"]) return "red";
  };

  return (
    <Tag size="sm" colorScheme={getColorStatut(statut)}>
      {formatStatut(statut)}
    </Tag>
  );
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
    action?: Exclude<DemandeStatutType, "supprimée">;
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
    trackEvent("intentions:ordre", { props: { colonne: column } });
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

  const getIntentionsQueryParameters = (qLimit: number, qOffset?: number) => ({
    ...filters,
    search,
    ...order,
    offset: qOffset,
    limit: qLimit,
    campagne,
  });

  const { data, isLoading } = client.ref("[GET]/intentions").useQuery(
    {
      query: getIntentionsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    { keepPreviousData: true, staleTime: 0 }
  );

  const hasPermissionEnvoi = usePermission("intentions-perdir/ecriture");

  const isCampagneEnCours =
    data?.campagne?.statut === CampagneStatutEnum["en cours"];
  const isDisabled =
    !isCampagneEnCours || isSaisieDisabled() || !hasPermissionEnvoi;

  const [searchIntention, setSearchIntention] = useState<string>(search);

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
  const bluefrance113 = useToken("colors", "bluefrance.113");

  const { mutateAsync: importDemande, isLoading: isSubmitting } = client
    .ref("[POST]/intention/import/:numero")
    .useMutation({
      onSuccess: (intention) => {
        router.push(`/intentions/perdir/saisie/${intention.numero}`);
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: error.message,
        });
      },
    });

  const [isImporting, setIsImporting] = useState(false);

  if (isLoading) return <IntentionSpinner />;

  return (
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
          getIntentionsQueryParameters={getIntentionsQueryParameters}
          searchIntention={searchIntention}
          setSearchIntention={setSearchIntention}
          campagnes={data?.campagnes}
          campagne={data?.campagne}
          page={page}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
        {data?.intentions.length ? (
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
                      {INTENTIONS_COLUMNS.libelleFormation}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("libelleEtablissement")}
                    >
                      <OrderIcon {...order} column="libelleEtablissement" />
                      {INTENTIONS_COLUMNS.libelleEtablissement}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("libelleDepartement")}
                    >
                      <OrderIcon {...order} column="libelleDepartement" />
                      {INTENTIONS_COLUMNS.libelleDepartement}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("typeDemande")}
                    >
                      <OrderIcon {...order} column="typeDemande" />
                      {INTENTIONS_COLUMNS.typeDemande}
                    </Th>
                    <Th cursor="pointer" onClick={() => handleOrder("statut")}>
                      <OrderIcon {...order} column="statut" />
                      {INTENTIONS_COLUMNS.statut}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("createdAt")}
                    >
                      <OrderIcon {...order} column="createdAt" />
                      {INTENTIONS_COLUMNS.createdAt}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("userName")}
                      w="15"
                    >
                      <OrderIcon {...order} column="userName" />
                      {INTENTIONS_COLUMNS.userName}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("updatedAt")}
                    >
                      <OrderIcon {...order} column="updatedAt" />
                      {INTENTIONS_COLUMNS.updatedAt}
                    </Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.intentions.map(
                    (
                      intention: (typeof client.infer)["[GET]/intentions"]["intentions"][0]
                    ) => (
                      <Tr
                        height={"60px"}
                        key={intention.numero}
                        cursor={isSaisieDisabled() ? "initial" : "pointer"}
                        whiteSpace={"pre"}
                        onClick={() => {
                          if (isSaisieDisabled()) return;
                          router.push(
                            `/intentions/perdir/saisie/${intention.numero}`
                          );
                        }}
                      >
                        <Td>{intention.numero}</Td>
                        <Td>
                          <Text
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"break-spaces"}
                            noOfLines={2}
                          >
                            {intention.libelleFormation}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"break-spaces"}
                            noOfLines={2}
                          >
                            {intention.libelleEtablissement}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"break-spaces"}
                            noOfLines={2}
                          >
                            {intention.libelleDepartement}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            whiteSpace={"break-spaces"}
                            noOfLines={2}
                          >
                            {intention.typeDemande
                              ? getTypeDemandeLabel(intention.typeDemande)
                              : null}
                          </Text>
                        </Td>
                        <Td align="center" w={0}>
                          <TagDemande statut={intention.statut} />
                        </Td>
                        <Td>{formatDate({ date: intention.createdAt })}</Td>
                        <Td w="15" textAlign={"center"}>
                          <Tooltip label={intention.userName}>
                            <Avatar
                              name={intention.userName}
                              colorScheme={getAvatarBgColor(
                                intention.userName ?? ""
                              )}
                              bg={getAvatarBgColor(intention.userName ?? "")}
                              color={"white"}
                              position={"unset"}
                            />
                          </Tooltip>
                        </Td>
                        <Td textAlign={"center"}>
                          {formatDate({ date: intention.updatedAt })}
                        </Td>
                        <Td textAlign={"center"}>
                          <Flex>
                            <IconButton
                              as={NextLink}
                              variant="link"
                              href={`/intentions/perdir/synthese/${intention.numero}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(
                                  `/intentions/perdir/synthese/${intention.numero}`
                                );
                              }}
                              aria-label="Voir la demande"
                              icon={
                                <Icon
                                  icon="ri:eye-line"
                                  width={"24px"}
                                  color={bluefrance113}
                                />
                              }
                              me={"auto"}
                            />
                          </Flex>
                        </Td>
                        {data?.campagne.statut ===
                          CampagneStatutEnum["terminée"] && (
                          <Td>
                            {intention.numeroDemandeImportee ? (
                              <Button
                                as={NextLink}
                                variant="link"
                                href={`/intentions/saisie/${intention.numeroDemandeImportee}`}
                                leftIcon={<ExternalLinkIcon />}
                                me={"auto"}
                              >
                                intention dupliquée{" "}
                                {intention.numeroDemandeImportee}
                              </Button>
                            ) : (
                              <Button
                                leftIcon={<Icon icon="ri:import-line" />}
                                variant={"newInput"}
                                onClick={(e) => {
                                  setIsImporting(true);
                                  if (intention.numeroDemandeImportee) return;
                                  e.preventDefault();
                                  e.stopPropagation();
                                  importDemande({
                                    params: { numero: intention.numero },
                                  });
                                }}
                                isDisabled={
                                  !!intention.numeroDemandeImportee ||
                                  isSubmitting ||
                                  isImporting
                                }
                              >
                                Dupliquer cette intention
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
          </>
        ) : (
          <Center mt={12}>
            <Flex flexDirection={"column"}>
              <Text fontSize={"2xl"}>Pas de demande à afficher</Text>
              {hasPermissionEnvoi && (
                <Button
                  isDisabled={isDisabled}
                  variant="createButton"
                  size={"lg"}
                  as={!isDisabled ? NextLink : undefined}
                  href="/intentions/perdir/saisie/new"
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
  );
};
