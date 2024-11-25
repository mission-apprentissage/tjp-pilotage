"use client";

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
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { StatutTag } from "@/app/(wrapped)/intentions/perdir/components/StatutTag";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { formatCodeDepartement, formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { usePermission } from "@/utils/security/usePermission";
import { useStateParams } from "@/utils/useFilters";

import { CorrectionDemandeButton } from "./components/CorrectionDemandeButton";
import { Header } from "./components/Header";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuBoiteReception } from "./components/MenuBoiteReception";
import { DEMANDES_COLUMNS } from "./DEMANDES_COLUMNS";
import type { Filters, Order } from "./types";
import { isSaisieDisabled } from "./utils/isSaisieDisabled";

const PAGE_SIZE = 30;

export const PageClient = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const trackEvent = usePlausible();

  const [searchParams, setSearchParams] = useStateParams<{
    filters?: Partial<Filters>;
    order?: Partial<Order>;
    page?: string;
    action?: Exclude<DemandeStatutType, "supprimée">;
    notfound?: string;
  }>({
    defaultValues: {
      filters: {},
      order: { order: "asc" },
      page: "0",
    },
  });

  const filters = searchParams.filters ?? {};
  const search = searchParams.filters?.search ?? "";
  const order = searchParams.order ?? { order: "asc" };
  const campagne = searchParams.filters?.campagne;
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const notFound = searchParams.notfound;

  useEffect(() => {
    if (notFound && !toast.isActive("not-found")) {
      toast({
        id: "not-found",
        status: "error",
        variant: "left-accent",
        title: `La demande ${notFound} n'a pas été trouvée`,
      });
    }
  }, [notFound]);

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("intentions:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleFilters = (type: keyof Filters, value: Filters[keyof Filters]) => {
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

  const getDemandesQueryParameters = (qLimit?: number, qOffset?: number) => ({
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

  const isCampagneEnCours = data?.campagne?.statut === CampagneStatutEnum["en cours"];
  const isDisabled = !isCampagneEnCours || isSaisieDisabled() || !hasPermissionSubmitIntention;

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
  const bluefrance113 = useToken("colors", "bluefrance.113");

  const { mutateAsync: importDemande, isLoading: isSubmitting } = client
    .ref("[POST]/demande/import/:numero")
    .useMutation({
      onSuccess: (demande) => {
        router.push(`/intentions/saisie/${demande.numero}`);
      },
      onError: (error) =>
        toast({
          status: "error",
          title: (isAxiosError(error) && error.response?.data?.message) ?? error.message,
        }),
    });

  const { mutate: submitSuivi } = client.ref("[POST]/demande/suivi").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été ajoutée à vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/demandes"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/demandes/count"],
        });
      }, 500);
    },
  });

  const { mutate: deleteSuivi } = client.ref("[DELETE]/demande/suivi/:id").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été supprimée de vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/demandes"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/demandes/count"],
        });
      }, 500);
    },
  });

  const [isImporting, setIsImporting] = useState(false);

  return (
    <Container maxWidth="100%" flex={1} flexDirection={["column", null, "row"]} display={"flex"} minHeight={0} py={4}>
      <MenuBoiteReception
        hasPermissionSubmitIntention={hasPermissionSubmitIntention}
        isRecapView
        campagne={data?.campagne}
        handleFilters={handleFilters}
        activeFilters={filters}
      />
      <Box display={["none", null, "unset"]} borderLeft="solid 1px" borderColor="gray.100" height="100%" mr={4} />
      <Flex flex={1} flexDirection="column" overflow="visible" minHeight={0} minW={0}>
        <Header
          // @ts-expect-error TODO
          activeFilters={filters}
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
        {isLoading ? (
          <IntentionSpinner />
        ) : data?.demandes.length ? (
          <>
            <TableContainer overflowY="auto" flex={1}>
              <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" variant="striped" fontSize="14px" gap="0">
                <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" bg="white" zIndex={"1"}>
                  <Tr>
                    <Th cursor="pointer" onClick={() => handleOrder("updatedAt")}>
                      <OrderIcon {...order} column="updatedAt" />
                      {DEMANDES_COLUMNS.updatedAt}
                    </Th>
                    <Th cursor="pointer" onClick={() => handleOrder("libelleFormation")}>
                      <OrderIcon {...order} column="libelleFormation" />
                      {DEMANDES_COLUMNS.libelleFormation}
                    </Th>
                    <Th cursor="pointer" onClick={() => handleOrder("libelleEtablissement")} w={400}>
                      <OrderIcon {...order} column="libelleEtablissement" />
                      {DEMANDES_COLUMNS.libelleEtablissement}
                    </Th>
                    <Th cursor="pointer" onClick={() => handleOrder("libelleDepartement")}>
                      <OrderIcon {...order} column="libelleDepartement" />
                      {DEMANDES_COLUMNS.libelleDepartement}
                    </Th>
                    <Th cursor="pointer" onClick={() => handleOrder("statut")} textAlign={"center"}>
                      <OrderIcon {...order} column="statut" />
                      {DEMANDES_COLUMNS.statut}
                    </Th>
                    <Th textAlign={"center"}>Actions</Th>
                    <Th cursor="pointer" onClick={() => handleOrder("typeDemande")} textAlign={"center"}>
                      <OrderIcon {...order} column="typeDemande" />
                      {DEMANDES_COLUMNS.typeDemande}
                    </Th>
                    <Th cursor="pointer" onClick={() => handleOrder("userName")} w="15">
                      <OrderIcon {...order} column="userName" />
                      {DEMANDES_COLUMNS.userName}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.demandes.map((demande: (typeof client.infer)["[GET]/demandes"]["demandes"][0]) => (
                    <Tr
                      height={"60px"}
                      position={"relative"}
                      key={demande.numero}
                      cursor={isSaisieDisabled() ? "initial" : "pointer"}
                      whiteSpace={"pre"}
                      onClick={() => {
                        if (isSaisieDisabled()) return;
                        router.push(`/intentions/saisie/${demande.numero}`);
                      }}
                    >
                      <Td textAlign={"center"}>
                        <Tooltip label={`Le ${format(demande.updatedAt, "d MMMM yyyy à HH:mm", { locale: fr })}`}>
                          {format(demande.updatedAt, "d MMM HH:mm", {
                            locale: fr,
                          })}
                        </Tooltip>
                      </Td>
                      <Td>
                        <Text textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"break-spaces"} noOfLines={2}>
                          {demande.libelleFormation}
                        </Text>
                      </Td>
                      <Td>
                        <Text textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"break-spaces"} noOfLines={2}>
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
                      <Td>
                        <Flex direction={"row"} gap={0} justifyContent={"left"}>
                          <Tooltip label="Voir la demande">
                            <IconButton
                              as={NextLink}
                              href={`/intentions/synthese/${demande.numero}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/intentions/synthese/${demande.numero}`);
                              }}
                              aria-label="Voir la demande"
                              color={"bluefrance.113"}
                              bgColor={"transparent"}
                              icon={<Icon icon="ri:eye-line" width={"24px"} color={bluefrance113} />}
                            />
                          </Tooltip>
                          <Tooltip label="Suivre la demande">
                            <IconButton
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!demande.suiviId)
                                  submitSuivi({
                                    body: {
                                      intentionNumero: demande.numero,
                                    },
                                  });
                                else
                                  deleteSuivi({
                                    params: { id: demande.suiviId },
                                  });
                              }}
                              aria-label="Suivre la demande"
                              color={"bluefrance.113"}
                              bgColor={"transparent"}
                              icon={
                                demande.suiviId ? (
                                  <Icon width="24px" icon="ri:bookmark-fill" />
                                ) : (
                                  <Icon width="24px" icon="ri:bookmark-line" />
                                )
                              }
                            />
                          </Tooltip>
                          {data?.campagne.statut === CampagneStatutEnum["terminée"] && (
                            <>
                              {demande.numeroDemandeImportee ? (
                                <Tooltip label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`}>
                                  <IconButton
                                    as={NextLink}
                                    href={`/intentions/saisie/${demande.numeroDemandeImportee}`}
                                    passHref
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`}
                                    color={"bluefrance.113"}
                                    bgColor={"transparent"}
                                    me={"auto"}
                                    icon={<Icon icon="ri:external-link-line" width={"24px"} color={bluefrance113} />}
                                  />
                                </Tooltip>
                              ) : (
                                <Tooltip label="Dupliquer la demande">
                                  <IconButton
                                    icon={<Icon icon="ri:file-copy-line" width={"24px"} color={bluefrance113} />}
                                    aria-label="Dupliquer la demande"
                                    color={"bluefrance.113"}
                                    bgColor={"transparent"}
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
                                  />
                                </Tooltip>
                              )}
                              <CorrectionDemandeButton demande={demande} />
                            </>
                          )}
                        </Flex>
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
                            colorScheme={getAvatarBgColor(demande.userName ?? "")}
                            bg={getAvatarBgColor(demande.userName ?? "")}
                            color={"white"}
                            position={"unset"}
                          />
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <TableFooter
              page={page}
              pageSize={PAGE_SIZE}
              count={data?.count}
              onPageChange={(newPage) => setSearchParams({ ...searchParams, page: `${newPage}` })}
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
