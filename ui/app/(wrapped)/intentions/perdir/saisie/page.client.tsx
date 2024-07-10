"use client";

import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  chakra,
  Container,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
  useToast,
  useToken,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useState } from "react";
import { hasRole } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { OrderIcon } from "@/components/OrderIcon";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { useAuth } from "@/utils/security/useAuth";
import { usePermission } from "@/utils/security/usePermission";

import {
  formatCodeDepartement,
  formatDepartementLibelleWithCodeDepartement,
} from "../../../utils/formatLibelle";
import { getTypeDemandeLabel } from "../../utils/typeDemandeUtils";
import { StatutTag } from "../components/StatutTag";
import { Header } from "./components/Header";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuIntention } from "./components/MenuIntention";
import { INTENTIONS_COLUMNS } from "./INTENTIONS_COLUMNS";
import { Filters, Order } from "./types";
import { canEditIntention, isSaisieDisabled } from "./utils/canEditIntention";

const PAGE_SIZE = 30;

export const PageClient = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryParams = useSearchParams();
  const hasEditIntentionPermission = usePermission(
    "intentions-perdir/ecriture"
  );
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
    { cacheTime: 0 }
  );

  const hasPermissionSubmitIntention = usePermission(
    "intentions-perdir/ecriture"
  );

  const isCampagneEnCours =
    data?.campagne?.statut === CampagneStatutEnum["en cours"];
  const isDisabled =
    !isCampagneEnCours || isSaisieDisabled() || !hasPermissionSubmitIntention;

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

  const { mutate: deleteIntention } = client
    .ref("[DELETE]/intention/:numero")
    .useMutation({
      onMutate: () => {
        setIsDeleting(true);
      },
      onSuccess: (_body) => {
        toast({
          variant: "left-accent",
          status: "success",
          title: "La demande a bien été supprimée",
        });
        // Wait until view is updated before invalidating queries
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["[GET]/intentions"] });
          queryClient.invalidateQueries({
            queryKey: ["[GET]/intentions/count"],
          });
          setIsDeleting(false);
          onClose();
        }, 500);
      },
    });

  const { mutate: submitSuivi } = client
    .ref("[POST]/intention/suivi")
    .useMutation({
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

  const { mutate: deleteSuivi } = client
    .ref("[DELETE]/intention/suivi/:id")
    .useMutation({
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

  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const canDelete = () => {
    return (
      hasPermissionSubmitIntention &&
      !hasRole({ user: auth?.user, role: "expert_region" }) &&
      !hasRole({ user: auth?.user, role: "region" })
    );
  };

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
        hasPermissionSubmitIntention={hasPermissionSubmitIntention}
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
          <TableContainer overflowY="auto" flex={1}>
            <Table
              sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }}
              size="md"
              fontSize="14px"
              gap="0"
            >
              <Thead
                position="sticky"
                top="0"
                boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
                bg="white"
                zIndex={"1"}
              >
                <Tr>
                  <Th cursor="pointer" onClick={() => handleOrder("updatedAt")}>
                    <OrderIcon {...order} column="updatedAt" />
                    {INTENTIONS_COLUMNS.updatedAt}
                  </Th>
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
                    onClick={() => handleOrder("statut")}
                    textAlign={"center"}
                  >
                    <OrderIcon {...order} column="statut" />
                    {INTENTIONS_COLUMNS.statut}
                  </Th>
                  <Th textAlign={"center"}>actions</Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleOrder("typeDemande")}
                    textAlign={"center"}
                  >
                    <OrderIcon {...order} column="typeDemande" />
                    {INTENTIONS_COLUMNS.typeDemande}
                  </Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleOrder("userName")}
                    w="15"
                  >
                    <OrderIcon {...order} column="userName" />
                    {INTENTIONS_COLUMNS.userName}
                  </Th>
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
                      whiteSpace={"pre"}
                      fontWeight={intention.alreadyAccessed ? "400" : "700"}
                      bg={intention.alreadyAccessed ? "grey.975" : "white"}
                    >
                      <Td textAlign={"center"}>
                        <Tooltip
                          label={`Le ${format(
                            intention.updatedAt,
                            "d MMMM yyyy à HH:mm",
                            { locale: fr }
                          )}`}
                        >
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
                        <Flex
                          direction={"row"}
                          gap={0}
                          justifyContent={"center"}
                        >
                          <Tooltip label="Voir la demande">
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
                            />
                          </Tooltip>
                          {canEditIntention({
                            intention,
                            hasEditIntentionPermission,
                            isPerdir: hasRole({
                              user: auth?.user,
                              role: "perdir",
                            }),
                          }) && (
                            <Tooltip label="Modifier la demande">
                              <IconButton
                                as={NextLink}
                                variant="link"
                                href={`/intentions/perdir/saisie/${intention.numero}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(
                                    `/intentions/perdir/saisie/${intention.numero}`
                                  );
                                }}
                                aria-label="Modifier la demande"
                                icon={
                                  <Icon
                                    icon="ri:pencil-line"
                                    width={"24px"}
                                    color={bluefrance113}
                                  />
                                }
                              />
                            </Tooltip>
                          )}
                          {canDelete() && (
                            <Tooltip
                              label="Supprimer la demande"
                              closeOnScroll={true}
                            >
                              <IconButton
                                variant={"link"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onOpen();
                                }}
                                aria-label="Supprimer la demande"
                                icon={
                                  <Icon
                                    icon="ri:delete-bin-line"
                                    width={"24px"}
                                    color={bluefrance113}
                                  />
                                }
                              />
                            </Tooltip>
                          )}
                          <Tooltip label="Suivre la demande">
                            <IconButton
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
                            />
                          </Tooltip>
                          <ModalDeleteIntention
                            isOpen={isOpen}
                            onClose={onClose}
                            numero={intention.numero}
                            isDeleting={isDeleting}
                            deleteIntention={() => {
                              deleteIntention({
                                params: { numero: intention.numero },
                              });
                            }}
                          />
                        </Flex>
                      </Td>
                      <Td textAlign={"center"}>
                        <Tag colorScheme="blue" size={"md"} h="fit-content">
                          {getTypeDemandeLabel(intention.typeDemande)}
                        </Tag>
                      </Td>
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
                      {data?.campagne.statut ===
                        CampagneStatutEnum["terminée"] && (
                        <Td>
                          {intention.numeroDemandeImportee ? (
                            <Button
                              as={NextLink}
                              variant="link"
                              href={`/intentions/perdir/saisie/${intention.numeroDemandeImportee}`}
                              leftIcon={<ExternalLinkIcon />}
                              me={"auto"}
                              onClick={(e) => e.stopPropagation()}
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
                                isImporting ||
                                !hasPermissionSubmitIntention
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

const ModalDeleteIntention = chakra(
  ({
    isOpen,
    onClose,
    numero,
    isDeleting,
    deleteIntention,
  }: {
    isOpen: boolean;
    onClose: () => void;
    numero: string;
    isDeleting: boolean;
    deleteIntention: () => void;
  }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay bgColor="rgba(0, 0, 0, 0.12)" />
        <ModalContent p="4">
          <ModalCloseButton title="Fermer" />
          <ModalHeader>
            <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
            Confirmer la suppression de l'intention n°{numero}
          </ModalHeader>
          <ModalBody>
            <Text color="red" mt={2}>
              Attention, ce changement est irréversible
            </Text>
          </ModalBody>

          {isDeleting ? (
            <Center>
              <IntentionSpinner />
            </Center>
          ) : (
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                variant={"secondary"}
                onClick={() => onClose()}
              >
                Annuler
              </Button>

              <Button
                isLoading={isDeleting}
                variant="primary"
                onClick={() => deleteIntention()}
              >
                Confirmer la suppression
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    );
  }
);
