"use client";

import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
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
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import type { AvisTypeType } from "shared/enum/avisTypeEnum";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { isCampagneTerminee } from "shared/utils/campagneUtils";

import { client } from "@/api.client";
import { StatutTag } from "@/app/(wrapped)/intentions/perdir/components/StatutTag";
import { getMessageAccompagnementCampagne } from "@/app/(wrapped)/intentions/utils/messageAccompagnementUtils";
import {canCorrectIntention, canCreateIntention, canDeleteIntention,canEditDemandeIntention, canImportIntention} from '@/app/(wrapped)/intentions/utils/permissionsIntentionUtils';
import { getStepWorkflow, getStepWorkflowAvis } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { formatCodeDepartement, formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { getRoutingSaisieRecueilDemande, getRoutingSyntheseRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";
import { useStateParams } from "@/utils/useFilters";

import { AvisTags } from "./components/AvisTags";
import { CorrectionIntentionButton } from "./components/CorrectionIntentionButton";
import { DeleteIntentionButton } from "./components/DeleteIntentionButton";
import { Header } from "./components/Header";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuBoiteReception } from "./components/MenuBoiteReception";
import { ProgressSteps } from "./components/ProgressSteps";
import { INTENTIONS_COLUMNS } from "./INTENTIONS_COLUMNS";
import type { Filters, Order } from "./types";

const PAGE_SIZE = 30;

export const PageClient = () => {
  const { user } = useAuth();
  const { campagne: currentCampagne } = useCurrentCampagne();
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notFound]);

  const trackEvent = usePlausible();

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("intentions:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleFilters = (type: keyof Filters, value: Filters[keyof Filters]) => {
    setSearchParams({
      ...searchParams,
      filters: { ...searchParams.filters, [type]: value },
    });
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("intentions:ordre", { props: { colonne: column } });

    const newOrder = {
      order: order?.orderBy === column && order?.order === "asc" ? "desc" : ("asc" as "asc" | "desc"),
      orderBy: column,
    };

    setSearchParams({
      ...searchParams,
      order: newOrder,
    });
  };

  const getIntentionsQueryParameters = (qLimit?: number, qOffset?: number) => ({
    ...searchParams.filters,
    ...order,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/intentions").useQuery(
    {
      query: getIntentionsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    { cacheTime: 0, keepPreviousData: true }
  );


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

  const { mutate: submitSuivi } = client.ref("[POST]/intention/suivi").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été ajoutée à vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/intentions"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/intentions/count"],
        });
      }, 500);
    },
  });

  const { mutate: deleteSuivi } = client.ref("[DELETE]/intention/suivi/:id").useMutation({
    onSuccess: (_body) => {
      toast({
        variant: "left-accent",
        status: "success",
        title: "La demande a bien été supprimée de vos demandes suivies",
      });
      // Wait until view is updated before invalidating queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["[GET]/intentions"] });
        queryClient.invalidateQueries({
          queryKey: ["[GET]/intentions/count"],
        });
      }, 500);
    },
  });

  const [isImporting, setIsImporting] = useState(false);

  if (!data) return <IntentionSpinner />;
  const isNouvelleDemandeDisabled = !canCreateIntention({ user, campagne: data.campagne, currentCampagne });

  return (
    <Container maxWidth="100%" flex={1} flexDirection={["column", null, "row"]} display={"flex"} minHeight={0} py={4}>
      <MenuBoiteReception
        isNouvelleDemandeDisabled={isNouvelleDemandeDisabled}
        isRecapView
        handleFilters={handleFilters}
        activeFilters={filters}
        campagne={data?.campagne}
        user={user!}
      />
      <Box display={["none", null, "unset"]} borderLeft="solid 1px" borderColor="gray.100" height="100%" mr={4} />
      <Flex flex={1} flexDirection="column" overflow="visible" minHeight={0} minW={0}>
        {(isLoading) ? (
          <IntentionSpinner />
        ) : (
          <>
            <Header
              activeFilters={filters}
              setSearchParams={setSearchParams}
              getIntentionsQueryParameters={getIntentionsQueryParameters}
              searchIntention={searchIntention}
              setSearchIntention={setSearchIntention}
              campagne={data?.campagne}
              filterTracker={filterTracker}
              academies={data?.filters.academies ?? []}
              diplomes={data?.filters.diplomes ?? []}
              campagnes={data?.filters.campagnes}
              handleFilters={handleFilters}
            />
            {data?.intentions.length ? (
              <>
                <TableContainer overflowY="auto" flex={1}>
                  <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" fontSize={14} gap="0">
                    <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" bg="white" zIndex={"1"}>
                      <Tr>
                        <Th cursor="pointer" onClick={() => handleOrder("updatedAt")} fontSize={12}>
                          <OrderIcon {...order} column="updatedAt" />
                          {INTENTIONS_COLUMNS.updatedAt}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("libelleFormation")} minW={300} maxW={300} fontSize={12}>
                          <OrderIcon {...order} column="libelleFormation" />
                          {INTENTIONS_COLUMNS.libelleFormation}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("libelleEtablissement")} minW={350} maxW={350} fontSize={12}>
                          <OrderIcon {...order} column="libelleEtablissement" />
                          {INTENTIONS_COLUMNS.libelleEtablissement}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("libelleDepartement")} fontSize={12}>
                          <OrderIcon {...order} column="libelleDepartement" />
                          {INTENTIONS_COLUMNS.libelleDepartement}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("statut")} textAlign={"center"} fontSize={12}>
                          <OrderIcon {...order} column="statut" />
                          {INTENTIONS_COLUMNS.statut}
                        </Th>
                        <Th textAlign={"center"} fontSize={12}>actions</Th>
                        <Th cursor="pointer" onClick={() => handleOrder("typeDemande")} textAlign={"center"} fontSize={12}>
                          <OrderIcon {...order} column="typeDemande" />
                          {INTENTIONS_COLUMNS.typeDemande}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("createdAt")} fontSize={12}>
                          <OrderIcon {...order} column="createdAt" />
                          {INTENTIONS_COLUMNS.createdAt}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("numeroDemandeImportee")} fontSize={12}>
                          <OrderIcon {...order} column="numeroDemandeImportee" />
                          {INTENTIONS_COLUMNS.numero}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("userName")} w="15" fontSize={12}>
                          <OrderIcon {...order} column="userName" />
                          {INTENTIONS_COLUMNS.userName}
                        </Th>
                        <Th cursor="pointer" onClick={() => handleOrder("inspecteurReferent")} minW={250} maxW={250} fontSize={12}>
                          <OrderIcon {...order} column="inspecteurReferent" />
                          {INTENTIONS_COLUMNS.inspecteurReferent}
                        </Th>
                        <Th textAlign={"center"} fontSize={12}>Progression</Th>
                        <Th fontSize={12}>Avis (Phase en cours)</Th>
                        <Th fontSize={12}>Derniers avis - Phase en cours</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.intentions.map((intention: (typeof client.infer)["[GET]/intentions"]["intentions"][0]) => {


                        const linkSynthese = getRoutingSyntheseRecueilDemande({
                          user,
                          campagne: data?.campagne,
                          suffix: intention.numero
                        });

                        const linkSaisie = getRoutingSaisieRecueilDemande({
                          user,
                          campagne: data?.campagne,
                          suffix: intention.numero
                        });

                        const linkSaisieImported = getRoutingSaisieRecueilDemande({
                          user,
                          campagne: data?.campagne,
                          suffix: intention.numeroDemandeImportee
                        });

                        const isModificationDisabled = !canEditDemandeIntention({
                          demandeIntention : {
                            ...intention,
                            campagne: data?.campagne,
                          },
                          user,
                        });

                        const isDeleteDisabled = !canDeleteIntention({
                          intention : {
                            ...intention,
                            campagne: data?.campagne,
                          },
                          user
                        });

                        const isImportDisabled = !canImportIntention({
                          isAlreadyImported: !!intention.numeroDemandeImportee,
                          isLoading: (isLoading || isSubmitting || isImporting),
                          user,
                          campagne: data?.campagne,
                        });

                        const isCorrectionDisabled = !canCorrectIntention({
                          intention : {
                            ...intention,
                            campagne: data?.campagne
                          },
                          user
                        });

                        return (
                          <Tr
                            height={"60px"}
                            key={intention.numero}
                            whiteSpace={"pre"}
                            fontWeight={intention.alreadyAccessed ? "400" : "700"}
                            bg={intention.alreadyAccessed ? "grey.975" : "white"}
                          >
                            <Td textAlign={"center"}>
                              <Tooltip label={`Le ${format(intention.updatedAt, "d MMMM yyyy à HH:mm", { locale: fr })}`}>
                                {format(intention.updatedAt, "d MMM HH:mm", {
                                  locale: fr,
                                })}
                              </Tooltip>
                            </Td>
                            <Td>
                              <Tooltip label={intention.libelleFormation}>
                                <Text
                                  textOverflow={"ellipsis"}
                                  overflow={"hidden"}
                                  whiteSpace={"break-spaces"}
                                  noOfLines={2}
                                >
                                  {intention.libelleFormation}
                                </Text>
                              </Tooltip>
                            </Td>
                            <Td>
                              <Tooltip label={intention.libelleEtablissement}>
                                <Text
                                  textOverflow={"ellipsis"}
                                  overflow={"hidden"}
                                  whiteSpace={"break-spaces"}
                                  noOfLines={2}
                                >
                                  {intention.libelleEtablissement}
                                </Text>
                              </Tooltip>
                            </Td>
                            <Td>
                              <Text
                                textAlign={"center"}
                                textOverflow={"ellipsis"}
                                overflow={"hidden"}
                                whiteSpace={"break-spaces"}
                                noOfLines={2}
                              >
                                <Tooltip
                                  label={formatDepartementLibelleWithCodeDepartement({
                                    libelleDepartement: intention.libelleDepartement,
                                    codeDepartement: intention.codeDepartement,
                                  })}
                                >
                                  {formatCodeDepartement(intention.codeDepartement)}
                                </Tooltip>
                              </Text>
                            </Td>
                            <Td textAlign={"center"} w={0}>
                              <StatutTag statut={intention.statut} size="md" />
                            </Td>
                            <Td textAlign={"center"}>
                              <Flex direction={"row"} gap={0} justifyContent={"left"}>
                                <Tooltip label="Voir la demande">
                                  <IconButton
                                    as={NextLink}
                                    href={linkSynthese}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      router.push(linkSynthese);
                                    }}
                                    aria-label="Voir la demande"
                                    color={"bluefrance.113"}
                                    bgColor={"transparent"}
                                    icon={<Icon icon="ri:eye-line" width={"24px"} color={bluefrance113} />}
                                  />
                                </Tooltip>
                                {
                                  !isModificationDisabled && (
                                    <Tooltip label="Modifier la demande">
                                      <IconButton
                                        disabled={isModificationDisabled}
                                        as={NextLink}
                                        href={linkSaisie}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          router.push(linkSaisie);
                                        }}
                                        aria-label="Modifier la demande"
                                        color={"bluefrance.113"}
                                        bgColor={"transparent"}
                                        icon={<Icon icon="ri:pencil-line" width={"24px"} color={bluefrance113} />}
                                      />
                                    </Tooltip>
                                  )}
                                { !isDeleteDisabled && (<DeleteIntentionButton intention={intention} />) }
                                <Tooltip label="Suivre la demande">
                                  <IconButton
                                    onClick={() => {
                                      if (!intention.suiviId)
                                        submitSuivi({
                                          body: {
                                            intentionNumero: intention.numero,
                                          },
                                        });
                                      else
                                        deleteSuivi({
                                          params: { id: intention.suiviId },
                                        });
                                    }}
                                    aria-label="Suivre la demande"
                                    color={"bluefrance.113"}
                                    bgColor={"transparent"}
                                    icon={
                                      intention.suiviId ? (
                                        <Icon width="24px" icon="ri:bookmark-fill" />
                                      ) : (
                                        <Icon width="24px" icon="ri:bookmark-line" />
                                      )
                                    }
                                  />
                                </Tooltip>
                                {isCampagneTerminee(data?.campagne) &&
                                (intention.numeroDemandeImportee ? (
                                  <Tooltip label={`Voir l'intention dupliquée ${intention.numeroDemandeImportee}`}>
                                    <IconButton
                                      as={NextLink}
                                      href={linkSaisieImported}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(linkSaisieImported);
                                      }}
                                      aria-label={`Voir l'intention dupliquée ${intention.numeroDemandeImportee}`}
                                      color={"bluefrance.113"}
                                      bgColor={"transparent"}
                                      icon={<Icon icon="ri:external-link-line" width={"24px"} color={bluefrance113} />}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip label={"Dupliquer la demande"}>
                                    <IconButton
                                      onClick={(e) => {
                                        if(isImportDisabled) return;
                                        setIsImporting(true);
                                        e.preventDefault();
                                        e.stopPropagation();
                                        importDemande({
                                          params: {
                                            numero: intention.numero,
                                          },
                                        });
                                      }}
                                      isDisabled={isImportDisabled}
                                      aria-label="Dupliquer la demande"
                                      color={"bluefrance.113"}
                                      bgColor={"transparent"}
                                      icon={<Icon icon="ri:file-copy-line" width={"24px"} color={bluefrance113} />}
                                    />
                                  </Tooltip>
                                ))}
                                {!isCorrectionDisabled &&
                                 (<CorrectionIntentionButton
                                   user={user}
                                   intention={intention}
                                   campagne={data?.campagne}
                                 />)
                                }
                              </Flex>
                            </Td>
                            <Td textAlign={"center"}>
                              <Tag colorScheme="blue" size={"md"} h="fit-content">
                                {getTypeDemandeLabel(intention.typeDemande)}
                              </Tag>
                            </Td>

                            <Td textAlign={"center"}>
                              <Tooltip label={`Le ${format(intention.createdAt, "d MMMM yyyy à HH:mm", { locale: fr })}`}>
                                {format(intention.createdAt, "d MMM HH:mm", {
                                  locale: fr,
                                })}
                              </Tooltip>
                            </Td>
                            <Td>
                              <Text
                                textOverflow={"ellipsis"}
                                overflow={"hidden"}
                                whiteSpace={"break-spaces"}
                                textAlign={"center"}
                              >
                                {intention.numero}
                              </Text>
                            </Td>
                            <Td w="15" textAlign={"center"}>
                              <Tooltip label={intention.userName}>
                                <Avatar
                                  name={intention.userName}
                                  colorScheme={getAvatarBgColor(intention.userName ?? "")}
                                  bg={getAvatarBgColor(intention.userName ?? "")}
                                  color={"white"}
                                  position={"unset"}
                                />
                              </Tooltip>
                            </Td>
                            <Td>
                              <Text textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"break-spaces"}>
                                {intention.inspecteurReferent}
                              </Text>
                            </Td>
                            <Td>
                              <ProgressSteps statut={intention.statut} />
                            </Td>
                            <Td>
                              <HStack w={"100%"} justify={"center"}>
                                <Tag size="md" color={"white"} bgColor={"bluefrance.525"} fontWeight={"bold"}>
                                  {
                                    intention.avis.filter(
                                      (avis) =>
                                        getStepWorkflowAvis(avis.type as AvisTypeType) ===
                                      getStepWorkflow(intention.statut)
                                    ).length
                                  }
                                </Tag>
                                <Text>({intention.avis.length} au total)</Text>
                              </HStack>
                            </Td>
                            <Td>
                              <AvisTags listeAvis={intention.avis} statut={intention.statut} />
                            </Td>
                          </Tr>
                        );})}
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
                <Flex direction={"column"}>
                  <Text fontSize={"2xl"}>Pas de demande à afficher</Text>
                  <Tooltip
                    label={getMessageAccompagnementCampagne({ campagne: data?.campagne, currentCampagne })}
                    shouldWrapChildren
                  >
                    <Flex>
                      <Button
                        isDisabled={isNouvelleDemandeDisabled}
                        variant="createButton"
                        size={"lg"}
                        as={isNouvelleDemandeDisabled ? undefined : NextLink}
                        href={getRoutingSaisieRecueilDemande({ campagne: data?.campagne, user, suffix: "new" })}
                        px={3}
                        mt={12}
                        mx={"auto"}
                      >
                          Nouvelle demande
                      </Button>
                    </Flex>
                  </Tooltip>
                </Flex>
              </Center>
            )}
          </>
        )}
      </Flex>
    </Container>
  );
};
