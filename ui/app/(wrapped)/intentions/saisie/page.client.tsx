"use client";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  chakra,
  Container,
  Flex,
  FormErrorMessage,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { client } from "@/api.client";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import {
  formatCodeDepartement,
  formatDepartementLibelleWithCodeDepartement,
} from "@/utils/formatLibelle";
import { usePermission } from "@/utils/security/usePermission";
import { useStateParams } from "@/utils/useFilters";

import { StatutTag } from "../perdir/components/StatutTag";
import {
  MotifCorrectionCampagne,
  MOTIFS_CORRECTION_LABELS,
} from "../utils/motifCorrectionUtils";
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
  const queryClient = useQueryClient();
  const router = useRouter();
  const trackEvent = usePlausible();

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
          title:
            (isAxiosError(error) && error.response?.data?.message) ??
            error.message,
        }),
    });

  const { mutate: submitSuivi } = client
    .ref("[POST]/demande/suivi")
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
    .ref("[DELETE]/demande/suivi/:id")
    .useMutation({
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
        {isLoading ? (
          <IntentionSpinner />
        ) : data?.demandes.length ? (
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
                  zIndex={"1"}
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
                      w={400}
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
                    {data?.campagne.statut ===
                      CampagneStatutEnum["terminée"] && (
                      <Th textAlign={"center"}>Actions</Th>
                    )}
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
                        {data?.campagne.statut ===
                          CampagneStatutEnum["terminée"] && (
                          <Td>
                            <Flex
                              direction={"row"}
                              gap={0}
                              justifyContent={"left"}
                            >
                              {demande.numeroDemandeImportee ? (
                                <Tooltip
                                  label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`}
                                >
                                  <IconButton
                                    as={NextLink}
                                    variant={"link"}
                                    aria-label={`Voir la demande dupliquée ${demande.numeroDemandeImportee}`}
                                    href={`/intentions/saisie/${demande.numeroDemandeImportee}`}
                                    icon={
                                      <Icon
                                        icon="ri:external-link-line"
                                        width={"24px"}
                                        color={bluefrance113}
                                      />
                                    }
                                    me={"auto"}
                                    passHref
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Tooltip>
                              ) : (
                                <Tooltip label="Dupliquer la demande">
                                  <IconButton
                                    icon={
                                      <Icon
                                        icon="ri:file-copy-line"
                                        width={"24px"}
                                        color={bluefrance113}
                                      />
                                    }
                                    variant="link"
                                    aria-label="Dupliquer la demande"
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
                              <Tooltip label="Voir la demande">
                                <IconButton
                                  as={NextLink}
                                  variant="link"
                                  href={`/intentions/perdir/synthese/${demande.numero}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push(
                                      `/intentions/perdir/synthese/${demande.numero}`
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
                              <Tooltip label="Suivre la demande">
                                <IconButton
                                  aria-label="Suivre la demande"
                                  color={"bluefrance.113"}
                                  bgColor={"transparent"}
                                  icon={
                                    demande.suiviId ? (
                                      <Icon
                                        width="24px"
                                        icon="ri:bookmark-fill"
                                      />
                                    ) : (
                                      <Icon
                                        width="24px"
                                        icon="ri:bookmark-line"
                                      />
                                    )
                                  }
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
                                />
                              </Tooltip>
                              <CorrectionDemande demande={demande} />
                            </Flex>
                          </Td>
                        )}
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

const CorrectionDemande = chakra(
  ({
    demande,
  }: {
    demande: (typeof client.infer)["[GET]/demandes"]["demandes"][0];
  }) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    const bluefrance113 = useToken("colors", "bluefrance.113");
    const [isCorrected, setIsCorrected] = useState<boolean>(
      !!demande.correction
    );

    const { mutateAsync: submitCorrection } = client
      .ref("[POST]/correction/submit")
      .useMutation({
        onSuccess: (_body) => {
          queryClient.invalidateQueries(["[GET]/demandes/"]);
          let message: string | null = null;
          message = "Correction enregistrée avec succès";

          if (message) {
            toast({
              variant: "left-accent",
              title: message,
            });
          }
        },
      });

    const {
      isOpen: isOpenModalAnnulation,
      onOpen: onOpenModalAnnulation,
      onClose: onCloseModalAnnulation,
    } = useDisclosure();

    const {
      isOpen: isOpenModalReport,
      onOpen: onOpenModalReport,
      onClose: onCloseModalReport,
    } = useDisclosure();

    const formReport = useForm<{
      motif: string;
    }>({
      mode: "onTouched",
      reValidateMode: "onChange",
    });

    const formAnnulation = useForm<{
      motif: string;
    }>({
      mode: "onTouched",
      reValidateMode: "onChange",
    });

    const [reportDemandeStep, setReportDemandeStep] = useState<1 | 2>(1);

    const [annulationDemandeStep, setAnnulationDemandeStep] = useState<1 | 2>(
      1
    );

    const getMotifCorrectionLabel = (
      campagne: string = CURRENT_ANNEE_CAMPAGNE
    ) => {
      return Object.entries(
        MOTIFS_CORRECTION_LABELS[campagne as MotifCorrectionCampagne]
      ).map(([value, label]) => ({
        value,
        label,
      }));
    };

    return (
      <>
        {demande.statut === DemandeStatutEnum["demande validée"] &&
          (isCorrected ? (
            <Tooltip label="Demande déjà corrigée">
              <Button
                ms={2}
                disabled={isCorrected}
                rightIcon={
                  <Icon icon="ri:arrow-down-s-line" color={bluefrance113} />
                }
                bgColor={"transparent"}
                border={"1px solid"}
                borderColor={bluefrance113}
                borderRadius="0"
                p={2}
                h={"fit-content"}
                opacity={0.3}
                cursor={"not-allowed"}
              >
                <Flex direction={"row"} gap={2}>
                  <Text color={bluefrance113}>Corriger la demande</Text>
                </Flex>
              </Button>
            </Tooltip>
          ) : (
            <Menu gutter={0} matchWidth={true}>
              <MenuButton
                ms={2}
                as={Button}
                rightIcon={
                  <Icon icon="ri:arrow-down-s-line" color={bluefrance113} />
                }
                bgColor={"transparent"}
                border={"1px solid"}
                borderColor={bluefrance113}
                borderRadius="0"
                p={2}
                h={"fit-content"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Flex direction={"row"} gap={2}>
                  <Text color={bluefrance113}>Corriger la demande</Text>
                </Flex>
              </MenuButton>
              <MenuList p={0}>
                <MenuItem
                  px={2}
                  py={3}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(
                      `/intentions/saisie/${demande.numero}?correction=true`
                    );
                  }}
                >
                  <Flex direction={"row"} h={"100%"} gap={2}>
                    <Icon
                      icon="ri:scales-3-line"
                      color={bluefrance113}
                      width={"18px"}
                    />
                    <Text color={bluefrance113}>Rectifier les capacités</Text>
                  </Flex>
                </MenuItem>
                <MenuItem
                  px={2}
                  py={3}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenModalReport();
                  }}
                >
                  <Flex direction={"row"} h={"100%"} gap={2}>
                    <Icon
                      icon="ri:corner-up-left-line"
                      color={bluefrance113}
                      width={"18px"}
                    />
                    <Text color={bluefrance113}>Reporter la demande</Text>
                  </Flex>
                </MenuItem>
                <MenuItem
                  px={2}
                  py={3}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenModalAnnulation();
                  }}
                >
                  <Flex direction={"row"} h={"100%"} gap={2}>
                    <Icon
                      icon="ri:close-line"
                      color={bluefrance113}
                      width={"18px"}
                    />
                    <Text color={bluefrance113}>Annuler la demande</Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          ))}
        <Modal
          isOpen={isOpenModalReport}
          onClose={onCloseModalReport}
          size={"xl"}
        >
          <ModalOverlay />
          {reportDemandeStep === 1 ? (
            <ModalContent p="4">
              <ModalCloseButton title="Fermer" />
              <ModalHeader>
                <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                Reporter la demande
              </ModalHeader>
              <ModalBody>
                <Text mb={4}>
                  Votre demande sera conservée dans son état initial. Si vous
                  souhaitez modifier les capacités vous devez le faire depuis le
                  parcours indiqué.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Flex direction="row">
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalReport();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setReportDemandeStep(2);
                    }}
                  >
                    Confirmer le report
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          ) : (
            <FormProvider {...formReport}>
              <ModalContent
                p="4"
                as="form"
                noValidate
                onSubmit={formReport.handleSubmit((correction) => {
                  submitCorrection({
                    body: {
                      correction: {
                        ...demande,
                        intentionNumero: demande.numero,
                        capaciteScolaire: demande.capaciteScolaireActuelle ?? 0,
                        capaciteApprentissage:
                          demande.capaciteApprentissageActuelle ?? 0,
                        capaciteScolaireActuelle:
                          demande.capaciteScolaireActuelle ?? 0,
                        capaciteScolaireColoree: 0,
                        capaciteApprentissageActuelle:
                          demande.capaciteApprentissageActuelle ?? 0,
                        capaciteApprentissageColoree: 0,
                        coloration: demande.coloration ?? false,
                        libelleColoration: demande.libelleColoration,
                        raison: "report",
                        motif: correction.motif,
                      },
                    },
                  });
                  onCloseModalReport();
                  setIsCorrected(true);
                })}
              >
                <ModalCloseButton title="Fermer" />
                <ModalHeader>
                  <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                  Merci de préciser le motif
                </ModalHeader>
                <ModalBody>
                  <Text mb={4}>
                    Pour quel motif êtes vous amené à modifier les capacités de
                    cette demande ?
                  </Text>
                  <Select
                    {...formReport.register("motif", {
                      required: "Veuillez choisir un motif",
                    })}
                    mb={4}
                  >
                    {getMotifCorrectionLabel().map((motif) => (
                      <option key={motif.value} value={motif.value}>
                        {motif.label}
                      </option>
                    ))}
                  </Select>

                  {!!formReport.formState.errors.motif && (
                    <FormErrorMessage>
                      {formReport.formState.errors.motif.message}
                    </FormErrorMessage>
                  )}
                  <Text mb={4} color={"info.text"}>
                    Après validation de ce formulaire, vous ne pourrez plus
                    apporter aucune modification
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalReport();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Valider le motif
                  </Button>
                </ModalFooter>
              </ModalContent>
            </FormProvider>
          )}
        </Modal>
        <Modal
          isOpen={isOpenModalAnnulation}
          onClose={onCloseModalAnnulation}
          size={"xl"}
        >
          <ModalOverlay />
          {annulationDemandeStep === 1 ? (
            <ModalContent p="4">
              <ModalCloseButton title="Fermer" />
              <ModalHeader>
                <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                Annuler la demande
              </ModalHeader>
              <ModalBody>
                <Text mb={4}>
                  Si vous annulez la demande, les capacités de la formation
                  seront remises au niveau antérieur à la validation de votre
                  demande.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Flex direction="row">
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalAnnulation();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setAnnulationDemandeStep(2);
                    }}
                  >
                    Confirmer l'annulation
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          ) : (
            <FormProvider {...formAnnulation}>
              <ModalContent
                p="4"
                as="form"
                noValidate
                onSubmit={formAnnulation.handleSubmit((correction) => {
                  submitCorrection({
                    body: {
                      correction: {
                        ...demande,
                        intentionNumero: demande.numero,
                        capaciteScolaire: demande.capaciteScolaireActuelle ?? 0,
                        capaciteApprentissage:
                          demande.capaciteApprentissageActuelle ?? 0,
                        capaciteScolaireActuelle:
                          demande.capaciteScolaireActuelle ?? 0,
                        capaciteScolaireColoree: 0,
                        capaciteApprentissageActuelle:
                          demande.capaciteApprentissageActuelle ?? 0,
                        capaciteApprentissageColoree: 0,
                        coloration: demande.coloration ?? false,
                        libelleColoration: demande.libelleColoration,
                        raison: "annulation",
                        motif: correction.motif,
                      },
                    },
                  });
                  onCloseModalAnnulation();
                  setIsCorrected(true);
                })}
              >
                <ModalCloseButton title="Fermer" />
                <ModalHeader>
                  <ArrowForwardIcon mr="2" verticalAlign={"middle"} />
                  Merci de préciser le motif
                </ModalHeader>
                <ModalBody>
                  <Text mb={4}>
                    Pour quel motif êtes vous amené à modifier les capacités de
                    cette demande ?
                  </Text>
                  <Select
                    {...formAnnulation.register("motif", {
                      required: "Veuillez choisir un role",
                    })}
                    isRequired={true}
                    mb={4}
                  >
                    {getMotifCorrectionLabel().map((motif) => (
                      <option key={motif.value} value={motif.value}>
                        {motif.label}
                      </option>
                    ))}
                  </Select>
                  <Text mb={4} color={"info.text"}>
                    Après validation de ce formulaire, vous ne pourrez plus
                    apporter aucune modification
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      onCloseModalAnnulation();
                    }}
                    variant={"secondary"}
                  >
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Valider le motif
                  </Button>
                </ModalFooter>
              </ModalContent>
            </FormProvider>
          )}
        </Modal>
      </>
    );
  }
);
