import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import NextLink from "next/link";
import { usePlausible } from "next-plausible";
import { useMemo, useState } from "react";
import { ApiType } from "shared";

import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";

import { api } from "../../../../../api.client";
import { Cadran } from "../../../../../components/Cadran";
import { OrderIcon } from "../../../../../components/OrderIcon";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { downloadCsv } from "../../../../../utils/downloadCsv";
import { useStateParams } from "../../../../../utils/useFilters";
import {
  Filters,
  OrderFormationsTransformationStats,
  PilotageTransformationStats,
  Scope,
} from "../types";

export const CadranSection = ({
  scope,
  parentFilters,
  scopeFilters,
}: {
  scope?: {
    type: Scope;
    value: string | undefined;
  };
  parentFilters: Partial<Filters>;
  scopeFilters?: PilotageTransformationStats["filters"];
}) => {
  const trackEvent = usePlausible();
  const [typeVue, setTypeVue] = useState<"cadran" | "tableau">("cadran");

  const toggleTypeVue = () => {
    if (typeVue === "cadran") setTypeVue("tableau");
    else setTypeVue("cadran");
  };

  const [filters, setFilters] = useStateParams({
    prefix: "quadrant",
    defaultValues: {
      tauxPression: undefined,
      status: undefined,
      type: undefined,
      order: undefined,
    } as {
      tauxPression?: "eleve" | "faible";
      status?: "submitted" | "draft";
      type?: "ouverture" | "fermeture";
      order?: Partial<OrderFormationsTransformationStats>;
    },
  });

  const order = filters.order;

  const [currentCfd, setFormationId] = useState<string | undefined>();

  const mergedFilters = {
    ...parentFilters,
    tauxPression: filters.tauxPression,
    status: filters.status,
    type: filters.type,
    codeRegion: scope?.type === "regions" ? scope.value : undefined,
    codeAcademie: scope?.type === "academies" ? scope.value : undefined,
    codeDepartement: scope?.type === "departements" ? scope.value : undefined,
  };

  const { data: { formations, stats } = {} } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["getformationsTransformationStats", mergedFilters, order],
    queryFn: api.getFormationsTransformationStats({
      query: {
        ...mergedFilters,
        ...order,
      },
    }).call,
  });

  const formation = useMemo(
    () => formations?.find((item) => item.cfd === currentCfd),
    [currentCfd, formations]
  );

  const getCadranPosition = (
    formation: ApiType<
      typeof api.getFormationsTransformationStats
    >["formations"][0]
  ): string => {
    if (stats?.tauxInsertion && stats?.tauxPoursuite) {
      if (
        formation.tauxInsertion >= stats?.tauxInsertion &&
        formation.tauxPoursuite < stats?.tauxPoursuite
      )
        return "q1";
      else if (
        formation.tauxInsertion >= stats?.tauxInsertion &&
        formation.tauxPoursuite > stats?.tauxPoursuite
      )
        return "q2";
      else if (
        formation.tauxInsertion < stats?.tauxInsertion &&
        formation.tauxPoursuite >= stats?.tauxPoursuite
      )
        return "q3";
      else if (
        formation.tauxInsertion < stats?.tauxInsertion &&
        formation.tauxPoursuite < stats?.tauxPoursuite
      )
        return "q4";
    }
    return "";
  };
  const getLibelleTerritoire = (
    territoires?: Array<{ label: string; value: string }>,
    code?: string
  ) => {
    if (scope?.value && scopeFilters)
      return _.find(territoires, (territoire) => territoire.value === code)
        ?.label;
    return undefined;
  };

  const getTdColor = (
    formation: ApiType<
      typeof api.getFormationsTransformationStats
    >["formations"][0]
  ) => {
    if (formation.cfd === currentCfd) return "white !important";
    return "";
  };

  const getTrBgColor = (
    formation: ApiType<
      typeof api.getFormationsTransformationStats
    >["formations"][0]
  ) => {
    if (formation.cfd === currentCfd) return "blue.main !important";
    switch (getCadranPosition(formation)) {
      case "q2":
        return "#C8F6D6";
      case "q4":
        return "#ffe2e1";
      default:
        return "inherit";
    }
  };

  const handleOrder = (
    column: OrderFormationsTransformationStats["orderBy"]
  ) => {
    trackEvent("tableau-cadran-intentions:ordre", {
      props: { colonne: column },
    });
    if (order?.orderBy !== column) {
      setFilters({
        ...filters,
        order: { order: "desc", orderBy: column },
      });
      return;
    }
    setFilters({
      ...filters,
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  return (
    <>
      <Heading mb="4" fontSize="2xl">
        DÉTAILS SUR LES FORMATIONS TRANSFORMÉES
      </Heading>
      <Card>
        <CardBody p="8">
          <Flex align="center">
            <Heading fontSize="md" mr="auto" color="bluefrance.113">
              RÉPARTITION DES OFFRES DE FORMATIONS TRANSFORMÉES
            </Heading>
            <Button onClick={() => toggleTypeVue()} variant="solid">
              <ViewIcon mr={2}></ViewIcon>
              {`Passer en vue ${typeVue === "cadran" ? "tableau" : "cadran"}`}
            </Button>
            <Button
              ml="6"
              aria-label="csv"
              variant="solid"
              onClick={async () => {
                if (!formations) return;
                downloadCsv(
                  "formations_transformees.csv",
                  formations.map((formation) => ({
                    ...formation,
                    cadranPosition: getCadranPosition(formation),
                    libelleRegion:
                      scope?.type === "regions"
                        ? getLibelleTerritoire(
                            scopeFilters?.regions,
                            scope.value
                          )
                        : undefined,
                    libelleAcademie:
                      scope?.type === "academies"
                        ? getLibelleTerritoire(
                            scopeFilters?.academies,
                            scope.value
                          )
                        : undefined,
                    libelleDepartement:
                      scope?.type === "departements"
                        ? getLibelleTerritoire(
                            scopeFilters?.departements,
                            scope.value
                          )
                        : undefined,
                  })),
                  {
                    libelleDiplome: "Formation",
                    libelleDispositif: "Dispositif",
                    tauxInsertion: "Taux d'emploi",
                    tauxPoursuite: "Taux de poursuite",
                    tauxPression: "Taux de pression",
                    cadranPosition: "Position dans le cadran",
                    libelleRegion: "Région",
                    libelleAcademie: "Académie",
                    libelleDepartement: "Département",
                  }
                );
              }}
            >
              <DownloadIcon mr="2" />
              Exporter en csv
            </Button>
            <Select
              ml="6"
              variant="newInput"
              bg="blue.main"
              color="white"
              maxW={250}
              value={filters.type ?? ""}
              onChange={(item) =>
                setFilters({
                  ...filters,
                  type: (item.target.value || undefined) as typeof filters.type,
                })
              }
            >
              <option value="" style={{ color: "black" }}>
                Places ouvertes et fermées
              </option>
              <option value="ouverture" style={{ color: "black" }}>
                Places ouvertes
              </option>
              <option value="fermeture" style={{ color: "black" }}>
                Places fermées
              </option>
            </Select>
          </Flex>
          <Flex mt="4">
            <Box p="4" w="300px" bg="#F3F5FC" mr="6">
              <Heading size="sm" mb="6">
                DÉTAILS SUR LA FORMATION
              </Heading>
              {!formation && (
                <Text color="gray.500">
                  Cliquez sur un point pour afficher le détail de la formation.
                </Text>
              )}

              {formation && (
                <>
                  <InfoBlock
                    textBg="white"
                    mb="4"
                    label="Formation concernée"
                    value={formation?.libelleDiplome}
                  />
                  <InfoBlock
                    textBg="white"
                    mb="4"
                    label="Dispositif"
                    value={formation?.libelleDispositif}
                  />
                  {(!filters.type || filters.type === "ouverture") && (
                    <InfoBlock
                      textBg="white"
                      mb="4"
                      label={"Places ouvertes"}
                      value={formation?.placesOuvertes ?? 0}
                    />
                  )}
                  {(!filters.type || filters.type === "fermeture") && (
                    <InfoBlock
                      textBg="white"
                      mb="4"
                      label={"Places fermées"}
                      value={formation?.placesFermees ?? 0}
                    />
                  )}
                  <Box mb="4">
                    <InfoBlock
                      textBg="white"
                      label="Établissements concernés"
                      value={formation?.nbEtablissements}
                    />
                    <Link
                      fontSize="xs"
                      as={NextLink}
                      target="_blank"
                      href={createParametrizedUrl("/intentions/restitution", {
                        filters: {
                          rentreeScolaire: "2024",
                          cfd: [formation.cfd],
                          codeDispositif: [formation.dispositifId],
                          typeDemande: filters.type
                            ? filters.type === "ouverture"
                              ? [
                                  "ouverture",
                                  "ouverture_compensation",
                                  "augmentation",
                                  "augmentation_compensation",
                                ]
                              : ["fermeture", "diminution"]
                            : undefined,
                        },
                      })}
                    >
                      Voir la liste des demandes
                    </Link>
                  </Box>

                  <InfoBlock
                    textBg="white"
                    mb="4"
                    label="Taux de pression"
                    value={
                      formation.tauxPression
                        ? formation?.tauxPression / 100
                        : "-"
                    }
                  />
                  <Text mb="1" fontWeight="medium">
                    Taux d'emploi régional
                  </Text>
                  <GraphWrapper
                    mb="4"
                    w="100%"
                    continuum={formation.continuum}
                    value={formation.tauxInsertion}
                  />
                  <Text mb="1" fontWeight="medium">
                    Taux de pousuite d'études régional
                  </Text>
                  <GraphWrapper
                    w="100%"
                    continuum={formation.continuum}
                    value={formation.tauxPoursuite}
                  />
                </>
              )}
            </Box>
            <Box flex="1">
              <Flex justify="flex-end">
                <Text color="grey" fontSize="sm" textAlign="left">
                  {formations?.length ?? "-"} certifications,
                </Text>
                <Text ml="2" color="grey" fontSize="sm" textAlign="right">
                  {formations?.reduce(
                    (acc, { placesOuvertes, placesFermees }) => {
                      if (filters.type === "fermeture")
                        return acc + (placesFermees ?? 0);
                      if (filters.type === "ouverture")
                        return acc + (placesOuvertes ?? 0);
                      return acc + (placesOuvertes + placesFermees ?? 0);
                    },
                    0
                  ) ?? "-"}{" "}
                  places
                </Text>
              </Flex>
              <AspectRatio flex={1} ratio={1}>
                <>
                  {formations &&
                    (typeVue === "cadran" ? (
                      <Cadran
                        onClick={({ cfd }) => setFormationId(cfd)}
                        meanInsertion={stats?.tauxInsertion}
                        meanPoursuite={stats?.tauxPoursuite}
                        itemId={(item) => item.cfd + item.dispositifId}
                        data={formations?.map((item) => ({
                          ...item,
                          tauxInsertion6mois: item.tauxInsertion,
                          tauxPoursuiteEtudes: item.tauxPoursuite,
                          effectif: item.differencePlaces,
                        }))}
                        itemColor={(item) =>
                          item.cfd === currentCfd ? "#fd3b4cb5" : undefined
                        }
                        effectifSizes={[
                          { max: 15, size: 6 },
                          { max: 60, size: 12 },
                          { max: 150, size: 20 },
                          { max: 100000, size: 30 },
                        ]}
                      />
                    ) : (
                      <Flex
                        direction="column"
                        flex={1}
                        position="relative"
                        minH="0"
                      >
                        <TableContainer
                          overflowY="auto"
                          flex={1}
                          position="relative"
                          width="100%"
                        >
                          <Table
                            variant="simple"
                            size={"sm"}
                            mb={"auto"}
                            mt={2}
                          >
                            <Thead
                              bgColor="#96A6D8"
                              h="12"
                              position="sticky"
                              top="0"
                              boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
                              zIndex={1}
                            >
                              <Tr>
                                <Th
                                  maxW="40%"
                                  color="white"
                                  cursor="pointer"
                                  onClick={() => handleOrder("libelleDiplome")}
                                >
                                  <OrderIcon
                                    {...order}
                                    column="libelleDiplome"
                                  />
                                  FORMATION
                                </Th>
                                <Th
                                  maxW="20%"
                                  isNumeric
                                  color="white"
                                  cursor="pointer"
                                  onClick={() => handleOrder("tauxPression")}
                                >
                                  <OrderIcon {...order} column="tauxPression" />
                                  TX PRESSION
                                </Th>
                                <Th
                                  maxW="20%"
                                  isNumeric
                                  color="white"
                                  cursor="pointer"
                                  onClick={() => handleOrder("tauxInsertion")}
                                >
                                  <OrderIcon
                                    {...order}
                                    column="tauxInsertion"
                                  />
                                  TX EMPLOI
                                </Th>
                                <Th
                                  maxW="20%"
                                  isNumeric
                                  color="white"
                                  cursor="pointer"
                                  onClick={() => handleOrder("tauxPoursuite")}
                                >
                                  <OrderIcon
                                    {...order}
                                    column="tauxPoursuite"
                                  />
                                  TX POURSUITE
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {formations.map((formation, index) => (
                                <Tr
                                  key={`${formation.cfd}-${index}`}
                                  bgColor={getTrBgColor(formation)}
                                  onClick={() => setFormationId(formation.cfd)}
                                  cursor="pointer"
                                >
                                  <Td
                                    whiteSpace="normal"
                                    color={getTdColor(formation)}
                                  >
                                    {formation.libelleDiplome}
                                  </Td>
                                  <Td isNumeric color={getTdColor(formation)}>
                                    {formation.tauxPression
                                      ? `${formation.tauxPression} %`
                                      : "-"}
                                  </Td>
                                  <Td
                                    isNumeric
                                    color={getTdColor(formation)}
                                  >{`${formation.tauxInsertion} %`}</Td>
                                  <Td
                                    isNumeric
                                    color={getTdColor(formation)}
                                  >{`${formation.tauxPoursuite} %`}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Flex>
                    ))}
                  {!formations && <Skeleton opacity="0.3" height="100%" />}
                </>
              </AspectRatio>
            </Box>
            <Box p="4" ml="6" bg="#F3F5FC" w="200px">
              <Heading size="sm" mb="6">
                FILTRES
              </Heading>
              <FormControl mb="6">
                <FormLabel>Taux de pression</FormLabel>
                <RadioGroup
                  as={Stack}
                  onChange={(v) => {
                    setFilters({
                      ...filters,
                      tauxPression: (v || undefined) as "eleve" | "faible",
                    });
                  }}
                  value={filters.tauxPression ?? ""}
                >
                  <Radio value="">Tous</Radio>
                  <Radio value="eleve">Élevé</Radio>
                  <Radio value="faible">Bas</Radio>
                </RadioGroup>
              </FormControl>
              <FormControl mb="6">
                <FormLabel>Statut de la demande</FormLabel>
                <RadioGroup
                  as={Stack}
                  onChange={(v) =>
                    setFilters({
                      ...filters,
                      status: (v || undefined) as
                        | "submitted"
                        | "draft"
                        | undefined,
                    })
                  }
                  value={filters.status ?? ""}
                >
                  <Radio value="">Toutes</Radio>
                  <Radio value="submitted">Validées</Radio>
                  <Radio value="draft">Projets</Radio>
                </RadioGroup>
              </FormControl>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
