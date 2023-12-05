"use client";

import { LinkIcon, WarningTwoIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";

import { usePermission } from "@/utils/security/usePermission";

import { client } from "../../../../api.client";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { OrderIcon } from "../../../../components/OrderIcon";
import { TableFooter } from "../../../../components/TableFooter";
import { createParametrizedUrl } from "../../../../utils/createParametrizedUrl";
import { downloadCsv, ExportColumns } from "../../../../utils/downloadCsv";
import { getTypeDemandeLabel } from "../../utils/typeDemandeUtils";
import { IntentionSpinner } from "./components/IntentionSpinner";
import { MenuIntention } from "./components/MenuIntention";

const DEMANDES_COLUMNS = {
  id: "id",
  cfd: "CFD",
  libelleDiplome: "Diplôme",
  dispositifId: "DispositifId",
  libelleDispositif: "Dispositif",
  libelleFCIL: "Libellé de la FCIL",
  uai: "UAI",
  libelleEtablissement: "Établissement",
  libelleDepartement: "Département",
  rentreeScolaire: "RS",
  typeDemande: "Type de demande",
  motif: "Motif",
  autreMotif: "Autre motif",
  coloration: "Coloration",
  libelleColoration: "Libelle coloration",
  amiCma: "AMI/CMA ?",
  poursuitePedagogique: "Poursuite pédagogique ?",
  commentaire: "Commentaire",
  status: "Status",
  codeRegion: "Code Region",
  codeAcademie: "Code Académie",
  createdAt: "Date de création",
  updatedAt: "Date de dernière modification",
  compensationCfd: "CFD compensé",
  compensationUai: "UAI compensé",
  compensationDispositifId: "Dispositif compensé",
  capaciteScolaireActuelle: "Capacité scolaire actuelle",
  capaciteScolaire: "Capacité scolaire",
  capaciteScolaireColoree: "Capacité scolaire coloree",
  capaciteApprentissageActuelle: "Capacité apprentissage actuelle",
  capaciteApprentissage: "Capacité apprentissage",
  capaciteApprentissageColoree: "Capacité apprentissage coloree",
  userName: "Créateur",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/demandes"]["demandes"][number]
>;

export type Query = (typeof client.inferArgs)["[GET]/demandes"]["query"];
export type Filters = Pick<Query, "status">;
export type Order = Pick<Query, "order" | "orderBy">;

const PAGE_SIZE = 30;

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

  const { data, isLoading } = client.ref("[GET]/demandes").useQuery(
    {
      query: {
        ...filters,
        ...order,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      },
    },
    { keepPreviousData: true, staleTime: 0 }
  );

  const nouvelleCompensation = (
    demandeCompensee: (typeof client.infer)["[GET]/demandes"]["demandes"][0]
  ) => {
    router.push(
      createParametrizedUrl(`${location.pathname}/new`, {
        intentionId: demandeCompensee.id,
        compensation: true,
      })
    );
  };

  const hasPermissionEnvoi = usePermission("intentions/ecriture");

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
  if (isLoading) return <IntentionSpinner />;

  return (
    <>
      <Container maxW="container.xl" py="4">
        <Breadcrumb
          ml={4}
          pages={[
            { title: "Accueil", to: "/" },
            {
              title: "Recueil des demandes",
              to: "/intentions/saisie",
              active: true,
            },
          ]}
        />
      </Container>
      <Container maxWidth="100%" flex={1} display={"flex"} minHeight={0}>
        <MenuIntention hasPermissionEnvoi={hasPermissionEnvoi} isRecapView />
        <Box borderLeft="solid 1px" borderColor="gray.100" height="100%" />
        <Flex flex={1} flexDirection="column" overflow="hidden" minHeight={0}>
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
                        onClick={() => handleOrder("libelleDiplome")}
                      >
                        <OrderIcon {...order} column="libelleDiplome" />
                        {DEMANDES_COLUMNS.libelleDiplome}
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
                      <Th>compensation</Th>
                      <Th
                        cursor="pointer"
                        onClick={() => handleOrder("status")}
                      >
                        <OrderIcon {...order} column="status" />
                        {DEMANDES_COLUMNS.status}
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
                        onClick={() => handleOrder("updatedAt")}
                      >
                        <OrderIcon {...order} column="updatedAt" />
                        {DEMANDES_COLUMNS.updatedAt}
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
                          key={demande.id}
                          cursor="pointer"
                          whiteSpace={"pre"}
                          onClick={() =>
                            router.push(`/intentions/saisie/${demande.id}`)
                          }
                        >
                          <Td>{demande.id}</Td>
                          <Td>
                            <Text
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"break-spaces"}
                              noOfLines={2}
                            >
                              {demande.libelleDiplome}
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
                          <Td>
                            {demande.compensationCfd &&
                            demande.compensationDispositifId &&
                            demande.compensationUai ? (
                              demande.idCompensation ? (
                                <Button
                                  _hover={{ bg: "gray.200" }}
                                  variant="ghost"
                                  whiteSpace={"break-spaces"}
                                  size="xs"
                                  py="2"
                                  height="auto"
                                  fontWeight="normal"
                                  leftIcon={<LinkIcon focusable={true} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/intentions/saisie/${demande.idCompensation}?compensation=true`
                                    );
                                  }}
                                >
                                  <Box textAlign="left">
                                    <Box whiteSpace="nowrap">
                                      {`${
                                        demande.typeCompensation
                                          ? getTypeDemandeLabel(
                                              demande.typeCompensation
                                            )
                                          : "Demande"
                                      } liée `}
                                    </Box>
                                    <Text textDecoration="underline">
                                      {demande.idCompensation}
                                    </Text>
                                  </Box>
                                </Button>
                              ) : (
                                <Button
                                  _hover={{ bg: "gray.200" }}
                                  variant="ghost"
                                  whiteSpace={"break-spaces"}
                                  size="xs"
                                  py="2"
                                  height="auto"
                                  fontWeight="normal"
                                  color="red.500"
                                  leftIcon={<WarningTwoIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nouvelleCompensation(demande);
                                  }}
                                >
                                  <Box textAlign="left" whiteSpace="nowrap">
                                    Aucune demande liée <br /> identifiée
                                  </Box>
                                </Button>
                              )
                            ) : (
                              <></>
                            )}
                          </Td>
                          <Td align="center" w={0}>
                            {demande.status === "draft" ? (
                              <Tag size="sm" colorScheme={"orange"}>
                                Projet de demande
                              </Tag>
                            ) : (
                              <Tag size="sm" colorScheme={"green"}>
                                Demande validée
                              </Tag>
                            )}
                          </Td>
                          <Td>
                            {new Date(demande.createdAt).toLocaleString()}
                          </Td>
                          <Td textAlign={"center"}>
                            {new Date(demande.updatedAt).toLocaleString()}
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
                pl="4"
                onExport={async () => {
                  trackEvent("demandes:export");
                  const data = await client.ref("[GET]/demandes").query({
                    query: { ...filters, ...order, limit: 10000000 },
                  });

                  downloadCsv(
                    "export_demandes.csv",
                    data.demandes,
                    DEMANDES_COLUMNS
                  );
                }}
                page={page}
                pageSize={PAGE_SIZE}
                count={data?.count}
                onPageChange={(newPage) => setSearchParams({ page: newPage })}
              />
            </>
          ) : (
            <Center mt={12}>
              <Flex flexDirection={"column"}>
                <Text fontSize={"2xl"}>Pas encore de demande à afficher</Text>
                {hasPermissionEnvoi && (
                  <Button
                    variant="createButton"
                    size={"lg"}
                    as={NextLink}
                    href="/intentions/new"
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
