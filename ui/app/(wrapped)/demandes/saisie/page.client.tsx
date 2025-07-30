"use client";

import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
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
import { hasPermission } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { PermissionEnum } from "shared/enum/permissionEnum";
import type { TypeAvisType } from "shared/enum/typeAvisEnum";
import { isCampagneTerminee } from "shared/utils/campagneUtils";

import { client } from "@/api.client";
import type { RapprochementValue  } from "@/app/(wrapped)/demandes/components/RapprochementTag";
import { getLienRapprochement,getRapprochementTooltip,RapprochementTag  } from "@/app/(wrapped)/demandes/components/RapprochementTag";
import { StatutTag } from "@/app/(wrapped)/demandes/components/StatutTag";
import { getMessageAccompagnementCampagne } from "@/app/(wrapped)/demandes/utils/messageAccompagnementUtils";
import { getStepWorkflow, getStepWorkflowAvis } from "@/app/(wrapped)/demandes/utils/statutUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/demandes/utils/typeDemandeUtils";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import type { DetailedApiError} from "@/utils/apiError";
import {getDetailedErrorMessage } from "@/utils/apiError";
import { formatCodeDepartement, formatDepartementLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { getRoutingAccessSaisieDemande, getRoutingAccesSyntheseDemande } from "@/utils/getRoutingAccesDemande";
import { canCheckDemande, canCreateDemande, canDeleteDemande,canEditDemande, canImportDemande} from "@/utils/permissionsDemandeUtils";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";
import { useStateParams } from "@/utils/useFilters";

import { AvisTags } from "./components/AvisTags";
import { DeleteDemandeButton } from "./components/DeleteDemandeButton";
import { DemandeSpinner } from "./components/DemandeSpinner";
import { Header } from "./components/Header";
import { MenuBoiteReception } from "./components/MenuBoiteReception";
import { ModificationDemandeButton } from "./components/ModificationDemandeButton";
import { ProgressSteps } from "./components/ProgressSteps";
import { DEMANDES_COLUMNS } from "./DEMANDES_COLUMNS";
import type { Filters, Order } from "./types";

const PAGE_SIZE = 30;

export type CheckedDemandesType = {
  statut: DemandeStatutType;
  demandes: Array<string>;
};
export interface ISearchParams {
  filters?: Partial<Filters>;
  order?: Partial<Order>;
  page?: string;
  action?: Exclude<DemandeStatutType, "supprimée">;
  notfound?: string;
}

export const PageClient = () => {
  const { user } = useAuth();
  const { campagne: currentCampagne } = useCurrentCampagne();
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const [searchParams, setSearchParams] = useStateParams<ISearchParams>({
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
    trackEvent("demandes:filtre", {
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
    trackEvent("demandes:ordre", { props: { colonne: column } });

    const newOrder = {
      order: order?.orderBy === column && order?.order === "asc" ? "desc" : ("asc" as "asc" | "desc"),
      orderBy: column,
    };

    setSearchParams({
      ...searchParams,
      order: newOrder,
    });
  };

  const getDemandesQueryParameters = (qLimit?: number, qOffset?: number) => ({
    ...searchParams.filters,
    ...order,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/demandes").useQuery(
    {
      query: getDemandesQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    { cacheTime: 0, keepPreviousData: true }
  );

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
        router.push(getRoutingAccessSaisieDemande({ user, campagne: currentCampagne, suffix: demande.numero }));
      },
      onError: (error) => {
        if(isAxiosError<DetailedApiError>(error)) {
          toast({
            variant: "left-accent",
            status: "error",
            title: Object.values(getDetailedErrorMessage(error) ?? {}).join(", ") ?? "Une erreur est survenue lors de l'import de la demande",
          });
        }
        setIsImporting(false);
      },
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

  const [ checkedDemandes, setCheckedDemandes ] = useState<CheckedDemandesType | undefined>();
  const [ statut, setStatut ] = useState<DemandeStatutType | undefined>();
  const canCheckDemandes = hasPermission(user?.role, PermissionEnum["demande-statut/ecriture"]);

  const onChangeCheckedDemandes = (demande: { statut: DemandeStatutType, numero: string }) => {
    setCheckedDemandes((prevState: CheckedDemandesType | undefined) => {
      if (!prevState?.demandes.length) {
      // Si checkedDemandes est undefined on initialise avec le statut donné
        return {
          statut: demande.statut,
          demandes: [demande.numero],
        };
      }

      const { demandes } = prevState;
      if (demandes.includes(demande.numero)) {
      // Si la demande est la seule sélectionnée, on retire le statut
        if(demandes.length === 1) {
          return undefined;
        }
        // Si la demande est déjà présente, on la retire
        return {
          ...prevState,
          demandes: demandes.filter((i) => i !== demande.statut),
        };
      } else {
      // Sinon, on l'ajoute
        return {
          ...prevState,
          demandes: [...demandes, demande.numero],
        };
      }
    });
  };

  const [isImporting, setIsImporting] = useState(false);
  const [isModifyingGroup, setIsModifyingGroup] = useState(false);

  if (!data) return <DemandeSpinner />;

  const isNouvelleDemandeDisabled = !canCreateDemande({
    user,
    campagne: data.campagne,
  });

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
          <DemandeSpinner />
        ) : (
          <>
            <Header
              activeFilters={filters}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              getDemandesQueryParameters={getDemandesQueryParameters}
              searchDemande={searchDemande}
              setSearchDemande={setSearchDemande}
              campagne={data?.campagne}
              filterTracker={filterTracker}
              academies={data?.filters.academies ?? []}
              diplomes={data?.filters.diplomes ?? []}
              campagnes={data?.filters.campagnes}
              handleFilters={handleFilters}
              checkedDemandes={checkedDemandes}
              setCheckedDemandes={setCheckedDemandes}
              setIsModifyingGroup={setIsModifyingGroup}
              statut={statut}
              setStatut={setStatut}
            />
            {isModifyingGroup ? (
              <DemandeSpinner mt={6}/>
            ) : <> {
              data?.demandes.length ? (
                <>
                  <TableContainer overflowY="auto" flex={1}>
                    <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" fontSize={14} gap="0">
                      <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" bg="white" zIndex={"1"}>
                        <Tr>
                          {canCheckDemandes && (
                            <Th textAlign={"center"}>
                              { checkedDemandes?.demandes.length &&
                                (
                                  <Checkbox
                                    onChange={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setCheckedDemandes(undefined);
                                    }}
                                    borderRadius={4}
                                    borderColor={"bluefrance.113"}
                                    bgColor={"white"}
                                    _checked={{
                                      bgColor: "bluefrance.113",
                                    }}
                                    colorScheme="bluefrance"
                                    iconColor={"white"}
                                    isChecked={true}
                                  />
                                )
                              }
                            </Th>
                          )}
                          <Th cursor="pointer" onClick={() => handleOrder("rapprochementOK")} fontSize={12}>
                            <OrderIcon {...order} column="rapprochementOK" />
                            {DEMANDES_COLUMNS.rapprochementOK}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("updatedAt")} fontSize={12}>
                            <OrderIcon {...order} column="updatedAt" />
                            {DEMANDES_COLUMNS.updatedAt}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("libelleFormation")} minW={300} maxW={300} fontSize={12}>
                            <OrderIcon {...order} column="libelleFormation" />
                            {DEMANDES_COLUMNS.libelleFormation}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("libelleEtablissement")} minW={350} maxW={350} fontSize={12}>
                            <OrderIcon {...order} column="libelleEtablissement" />
                            {DEMANDES_COLUMNS.libelleEtablissement}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("libelleDepartement")} fontSize={12}>
                            <OrderIcon {...order} column="libelleDepartement" />
                            {DEMANDES_COLUMNS.libelleDepartement}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("statut")} textAlign={"center"} fontSize={12}>
                            <OrderIcon {...order} column="statut" />
                            {DEMANDES_COLUMNS.statut}
                          </Th>
                          <Th textAlign={"center"} fontSize={12}>actions</Th>
                          <Th cursor="pointer" onClick={() => handleOrder("typeDemande")} textAlign={"center"} fontSize={12}>
                            <OrderIcon {...order} column="typeDemande" />
                            {DEMANDES_COLUMNS.typeDemande}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("createdAt")} fontSize={12}>
                            <OrderIcon {...order} column="createdAt" />
                            {DEMANDES_COLUMNS.createdAt}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("numeroDemandeImportee")} fontSize={12}>
                            <OrderIcon {...order} column="numeroDemandeImportee" />
                            {DEMANDES_COLUMNS.numero}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("userName")} w="15" fontSize={12}>
                            <OrderIcon {...order} column="userName" />
                            {DEMANDES_COLUMNS.userName}
                          </Th>
                          <Th cursor="pointer" onClick={() => handleOrder("inspecteurReferent")} minW={250} maxW={250} fontSize={12}>
                            <OrderIcon {...order} column="inspecteurReferent" />
                            {DEMANDES_COLUMNS.inspecteurReferent}
                          </Th>
                          <Th textAlign={"center"} fontSize={12}>Progression</Th>
                          <Th fontSize={12}>Avis (Phase en cours)</Th>
                          <Th fontSize={12}>Derniers avis - Phase en cours</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.demandes.map((demande: (typeof client.infer)["[GET]/demandes"]["demandes"][0]) => {

                          const linkSaisieImported = getRoutingAccessSaisieDemande({
                            user,
                            campagne: data?.campagne,
                            suffix: demande.numeroDemandeImportee
                          });

                          const linkSynthese = getRoutingAccesSyntheseDemande({
                            user,
                            campagne: data?.campagne,
                            suffix: demande.numero
                          });

                          const isModificationDisabled = !canEditDemande({
                            demande : {
                              ...demande,
                              campagne: data?.campagne,
                            },
                            user,
                          });

                          const isDeleteDisabled = !canDeleteDemande({
                            demande : {
                              ...demande,
                              campagne: data?.campagne,
                            },
                            user
                          });

                          const isImportDisabled = !canImportDemande({
                            isAlreadyImported: !!demande.numeroDemandeImportee,
                            isLoading: (isLoading || isSubmitting || isImporting),
                            user,
                            campagne: data?.campagne,
                          });

                          const isChecked = checkedDemandes !== undefined &&
                          checkedDemandes.demandes.length > 0 &&
                          checkedDemandes.demandes.includes(demande.numero);
                          const canBeChecked = canCheckDemande({
                            demande: {
                              ...demande,
                              campagne: data?.campagne
                            },
                            checkedDemandes,
                            user
                          });

                          return (
                            <Tr
                              height={"60px"}
                              key={demande.numero}
                              whiteSpace={"pre"}
                              fontWeight={demande.alreadyAccessed ? "400" : "700"}
                              bg={demande.alreadyAccessed ? "grey.975" : "white"}
                            >
                              {canCheckDemandes && (
                                <Td textAlign={"center"}>
                                  <Tooltip isDisabled={canBeChecked}
                                    closeOnScroll={true}
                                    label={
                                      isModificationDisabled ?
                                        "Cette demande a un statut qui ne permet pas sa sélection pour modification." :
                                        "Vous avez sélectionné une demande dont le statut est différent, ce qui ne permet pas de modifier le statut de manière groupée."}
                                    shouldWrapChildren
                                  >
                                    <Checkbox
                                      onChange={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onChangeCheckedDemandes(demande);
                                      }}
                                      borderRadius={4}
                                      borderColor={"bluefrance.113"}
                                      bgColor={"white"}
                                      _checked={{
                                        bgColor: "bluefrance.113",
                                      }}
                                      colorScheme="bluefrance"
                                      iconColor={"white"}
                                      isChecked={isChecked}
                                      isDisabled={!canBeChecked}
                                    />
                                  </Tooltip>
                                </Td>
                              )}
                              <Td>
                                <Link
                                  as={NextLink}
                                  href={getLienRapprochement(
                                    demande.rapprochementOK,
                                    demande.uai,
                                    demande.cfd,
                                    demande.numero
                                  )}
                                  target="_blank"
                                >
                                  <Tooltip label={getRapprochementTooltip(
                                    demande.rapprochementOK as RapprochementValue
                                  )}>
                                    <Text
                                      textOverflow={"ellipsis"}
                                      overflow={"hidden"}
                                      whiteSpace={"break-spaces"}
                                      noOfLines={2}
                                    >
                                      {<RapprochementTag value={demande.rapprochementOK} />}
                                    </Text>
                                  </Tooltip>

                                </Link>
                              </Td>
                              <Td textAlign={"center"}>
                                <Tooltip label={`Le ${format(demande.updatedAt, "d MMMM yyyy à HH:mm", { locale: fr })}`}>
                                  {format(demande.updatedAt, "d MMM HH:mm", {
                                    locale: fr,
                                  })}
                                </Tooltip>
                              </Td>
                              <Td>
                                <Tooltip label={demande.libelleFormation}>
                                  <Text
                                    textOverflow={"ellipsis"}
                                    overflow={"hidden"}
                                    whiteSpace={"break-spaces"}
                                    noOfLines={2}
                                  >
                                    {demande.libelleFormation}
                                  </Text>
                                </Tooltip>
                              </Td>
                              <Td>
                                <Tooltip label={demande.libelleEtablissement}>
                                  <Text
                                    textOverflow={"ellipsis"}
                                    overflow={"hidden"}
                                    whiteSpace={"break-spaces"}
                                    noOfLines={2}
                                  >
                                    {demande.libelleEtablissement}
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
                                      libelleDepartement: demande.libelleDepartement,
                                      codeDepartement: demande.codeDepartement,
                                    })}
                                  >
                                    {formatCodeDepartement(demande.codeDepartement)}
                                  </Tooltip>
                                </Text>
                              </Td>
                              <Td textAlign={"center"} w={0}>
                                <StatutTag statut={demande.statut} size="md" />
                              </Td>
                              <Td textAlign={"center"}>
                                <Flex direction={"row"} gap={0} justifyContent={"left"}>
                                  <Tooltip label="Voir la demande" shouldWrapChildren>
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
                                  <ModificationDemandeButton
                                    user={user}
                                    demande={demande}
                                    campagne={data?.campagne}
                                    onChangeCheckedDemandes={onChangeCheckedDemandes}
                                    setStatut={setStatut}
                                  />
                                  {!isDeleteDisabled && (<DeleteDemandeButton demande={demande} />) }
                                  <Tooltip label="Suivre la demande" shouldWrapChildren>
                                    <IconButton
                                      onClick={() => {
                                        if (!demande.suiviId)
                                          submitSuivi({
                                            body: {
                                              demandeNumero: demande.numero,
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
                                  {isCampagneTerminee(data?.campagne) &&
                                (demande.numeroDemandeImportee ? (
                                  <Tooltip label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`} shouldWrapChildren>
                                    <IconButton
                                      as={NextLink}
                                      href={linkSaisieImported}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(linkSaisieImported);
                                      }}
                                      aria-label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`}
                                      color={"bluefrance.113"}
                                      bgColor={"transparent"}
                                      icon={<Icon icon="ri:external-link-line" width={"24px"} color={bluefrance113} />}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip label={"Dupliquer la demande"} shouldWrapChildren>
                                    <IconButton
                                      onClick={(e) => {
                                        if(isImportDisabled) return;
                                        setIsImporting(true);
                                        e.preventDefault();
                                        e.stopPropagation();
                                        importDemande({
                                          params: {
                                            numero: demande.numero,
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
                                </Flex>
                              </Td>
                              <Td textAlign={"center"}>
                                <Tag colorScheme="blue" size={"md"} h="fit-content">
                                  {getTypeDemandeLabel(demande.typeDemande)}
                                </Tag>
                              </Td>

                              <Td textAlign={"center"}>
                                <Tooltip label={`Le ${format(demande.createdAt, "d MMMM yyyy à HH:mm", { locale: fr })}`}>
                                  {format(demande.createdAt, "d MMM HH:mm", {
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
                                  {demande.numero}
                                </Text>
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
                              <Td>
                                <Text textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"break-spaces"}>
                                  {demande.inspecteurReferent}
                                </Text>
                              </Td>
                              <Td>
                                <ProgressSteps statut={demande.statut} />
                              </Td>
                              <Td>
                                <HStack w={"100%"} justify={"center"}>
                                  <Tag size="md" color={"white"} bgColor={"bluefrance.525"} fontWeight={"bold"}>
                                    {
                                      demande.avis.filter(
                                        (avis) =>
                                          getStepWorkflowAvis(avis.type as TypeAvisType) ===
                                        getStepWorkflow(demande.statut)
                                      ).length
                                    }
                                  </Tag>
                                  <Text>({demande.avis.length} au total)</Text>
                                </HStack>
                              </Td>
                              <Td>
                                <AvisTags listeAvis={demande.avis} statut={demande.statut} />
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
                      label={getMessageAccompagnementCampagne({
                        campagne: data?.campagne,
                        currentCampagne: currentCampagne!,
                        user
                      })}
                      shouldWrapChildren
                    >
                      <Flex>
                        <Button
                          isDisabled={isNouvelleDemandeDisabled}
                          variant="createButton"
                          size={"lg"}
                          as={!isNouvelleDemandeDisabled ? undefined : NextLink}
                          href={getRoutingAccessSaisieDemande({ user, suffix: `new?campagneId=${data?.campagne.id}`})}
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
            }
          </>
        )}
      </Flex>
    </Container>
  );
};
