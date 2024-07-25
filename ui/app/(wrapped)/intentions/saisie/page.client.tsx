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
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useState } from "react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { OrderIcon } from "@/components/OrderIcon";
import { usePermission } from "@/utils/security/usePermission";

import { TableFooter } from "../../../../components/TableFooter";
import { useStateParams } from "../../../../utils/useFilters";
import {
  formatCodeDepartement,
  formatDepartementLibelleWithCodeDepartement,
} from "../../utils/formatLibelle";
import { StatutTag } from "../perdir/components/StatutTag";
import { getTypeDemandeLabel } from "../utils/typeDemandeUtils";
import { Header } from "./components/Header";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuIntention } from "./components/MenuIntention";
import { DEMANDES_COLUMNS } from "./DEMANDES_COLUMNS";
import { Filters, Order } from "./types";
import { isSaisieDisabled } from "./utils/isSaisieDisabled";

const PAGE_SIZE = 30;

export const PageClient = () => {
  const toast = useToast();
  const router = useRouter();
  const [searchParams, setSearchParams] = useStateParams<{
    filters?: Partial<Filters>;
    search?: string;
    order?: Partial<Order>;
    page?: string;
    campagne?: string;
    action?: Exclude<DemandeStatutType, "supprimée">;
  }>({
    defaultValues: {
      filters: {},
      search: "",
      order: { order: "asc" },
      page: "0",
    },
  });

  const filters = searchParams.filters ?? {};
  const search = searchParams.search ?? "";
  const order = searchParams.order ?? { order: "asc" };
  const campagne = searchParams.campagne;
  const page = searchParams.page ? parseInt(searchParams.page) : 0;

  const trackEvent = usePlausible();

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("intentions:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    setSearchParams({
      ...searchParams,
      filters: { ...filters, [type]: value },
    });
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("demandes:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({
        ...searchParams,
        order: { order: "desc", orderBy: column },
      });
      return;
    }
    setSearchParams({
      ...searchParams,
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
    { keepPreviousData: true, cacheTime: 0 }
  );

  const hasPermissionSubmitIntention = usePermission("intentions/ecriture");

  const isCampagneEnCours =
    data?.campagne?.statut === CampagneStatutEnum["en cours"];
  const isDisabled =
    !isCampagneEnCours || isSaisieDisabled() || !hasPermissionSubmitIntention;

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

  const { mutateAsync: importDemande, isLoading: isSubmitting } = client
    .ref("[POST]/demande/import/:numero")
    .useMutation({
      onSuccess: (demande) => {
        router.push(`/intentions/saisie/${demande.numero}`);
      },
      onError: (error) =>
        toast({
          status: "error",
          title:
            (isAxiosError(error) && error.response?.data?.message) ??
            error.message,
        }),
    });

  const [isImporting, setIsImporting] = useState(false);

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
        hasPermissionSubmitIntention={hasPermissionSubmitIntention}
        isRecapView
        campagne={data?.campagne}
        handleFilters={handleFilters}
        searchParams={searchParams}
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
          activeFilters={filters}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          getDemandesQueryParameters={getDemandesQueryParameters}
          searchDemande={searchDemande}
          setSearchDemande={setSearchDemande}
          campagnes={data?.campagnes}
          campagne={data?.campagne}
          filterTracker={filterTracker}
          handleFilters={handleFilters}
          diplomes={data?.filters.diplomes ?? []}
          academies={data?.filters.academies ?? []}
        />
        {isLoading && <IntentionSpinner />}
        {!isLoading && data?.demandes.length ? (
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
                  zIndex={2}
                >
                  <Tr>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("updatedAt")}
                    >
                      <OrderIcon {...order} column="updatedAt" />
                      {DEMANDES_COLUMNS.updatedAt}
                    </Th>
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
                      onClick={() => handleOrder("statut")}
                      textAlign={"center"}
                    >
                      <OrderIcon {...order} column="statut" />
                      {DEMANDES_COLUMNS.statut}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("typeDemande")}
                      textAlign={"center"}
                    >
                      <OrderIcon {...order} column="typeDemande" />
                      {DEMANDES_COLUMNS.typeDemande}
                    </Th>
                    <Th
                      cursor="pointer"
                      onClick={() => handleOrder("userName")}
                      w="15"
                    >
                      <OrderIcon {...order} column="userName" />
                      {DEMANDES_COLUMNS.userName}
                    </Th>
                    {data?.campagne.statut ===
                      CampagneStatutEnum["terminée"] && <Th />}
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.demandes.map(
                    (
                      demande: (typeof client.infer)["[GET]/demandes"]["demandes"][0]
                    ) => (
                      <Tr
                        height={"60px"}
                        position={"relative"}
                        zIndex={1}
                        key={demande.numero}
                        cursor={isSaisieDisabled() ? "initial" : "pointer"}
                        whiteSpace={"pre"}
                        onClick={() => {
                          if (isSaisieDisabled()) return;
                          router.push(`/intentions/saisie/${demande.numero}`);
                        }}
                      >
                        <Td textAlign={"center"}>
                          <Tooltip
                            label={`Le ${format(
                              demande.updatedAt,
                              "d MMMM yyyy à HH:mm",
                              { locale: fr }
                            )}`}
                          >
                            {format(demande.updatedAt, "d MMM HH:mm", {
                              locale: fr,
                            })}
                          </Tooltip>
                        </Td>
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
                          <Tooltip
                            label={formatDepartementLibelleWithCodeDepartement({
                              libelleDepartement: demande.libelleDepartement,
                              codeDepartement: demande.codeDepartement,
                            })}
                          >
                            <Text
                              textAlign={"center"}
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"break-spaces"}
                              noOfLines={2}
                            >
                              {formatCodeDepartement(demande.codeDepartement)}
                            </Text>
                          </Tooltip>
                        </Td>

                        <Td textAlign={"center"} w={0}>
                          <StatutTag statut={demande.statut} size="md" />
                        </Td>
                        <Td textAlign={"center"}>
                          <Tag colorScheme="blue" size={"md"} h="fit-content">
                            {getTypeDemandeLabel(demande.typeDemande)}
                          </Tag>
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
                                passHref
                                onClick={(e) => e.stopPropagation()}
                              >
                                Demande dupliquée{" "}
                                {demande.numeroDemandeImportee}
                              </Button>
                            ) : (
                              <Button
                                leftIcon={<Icon icon="ri:import-line" />}
                                variant={"newInput"}
                                onClick={(e) => {
                                  setIsImporting(true);
                                  if (demande.numeroDemandeImportee) return;
                                  e.preventDefault();
                                  e.stopPropagation();
                                  importDemande({
                                    params: { numero: demande.numero },
                                  });
                                }}
                                isDisabled={
                                  !!demande.numeroDemandeImportee ||
                                  isSubmitting ||
                                  isImporting ||
                                  !hasPermissionSubmitIntention
                                }
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
              page={page}
              pageSize={PAGE_SIZE}
              count={data?.count}
              onPageChange={(newPage) =>
                setSearchParams({ ...searchParams, page: `${newPage}` })
              }
            />
          </>
        ) : (
          <Center mt={12}>
            <Flex flexDirection={"column"}>
              <Text fontSize={"2xl"}>Pas de demande à afficher</Text>
              {hasPermissionSubmitIntention && (
                <Button
                  isDisabled={isDisabled}
                  variant="createButton"
                  size={"lg"}
                  as={!isDisabled ? NextLink : undefined}
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
  );
};
