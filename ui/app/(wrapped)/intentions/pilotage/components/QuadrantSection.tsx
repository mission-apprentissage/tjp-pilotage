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
  Text,
} from "@chakra-ui/react";
import _ from "lodash";
import NextLink from "next/link";
import { usePlausible } from "next-plausible";
import { useMemo, useState } from "react";
import { ScopeEnum } from "shared";

import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";
import { TooltipIcon } from "@/components/TooltipIcon";

import { client } from "../../../../../api.client";
import { Quadrant } from "../../../../../components/Quadrant";
import { TableQuadrant } from "../../../../../components/TableQuadrant";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { downloadCsv } from "../../../../../utils/downloadCsv";
import { useStateParams } from "../../../../../utils/useFilters";
import {
  Filters,
  OrderFormationsTransformationStats,
  PilotageTransformationStats,
  SelectedScope,
} from "../types";

export const QuadrantSection = ({
  scope,
  parentFilters,
  scopeFilters,
}: {
  scope?: SelectedScope;
  parentFilters: Partial<Filters>;
  scopeFilters?: PilotageTransformationStats["filters"];
}) => {
  const trackEvent = usePlausible();
  const [typeVue, setTypeVue] = useState<"quadrant" | "tableau">("quadrant");

  const toggleTypeVue = () => {
    if (typeVue === "quadrant") setTypeVue("tableau");
    else setTypeVue("quadrant");
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
  const { ...otherFilters } = parentFilters;
  const mergedFilters = {
    ...otherFilters,
    tauxPression: filters.tauxPression,
    status: filters.status,
    type: filters.type,
    codeRegion: scope?.type === ScopeEnum.region ? scope.value : undefined,
    codeAcademie: scope?.type === ScopeEnum.academie ? scope.value : undefined,
    codeDepartement:
      scope?.type === ScopeEnum.departement ? scope.value : undefined,
  };

  const { data: { formations, stats } = {} } = client
    .ref("[GET]/pilotage-transformation/formations")
    .useQuery(
      {
        query: {
          ...mergedFilters,
          ...order,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const formation = useMemo(
    () => formations?.find((item) => item.cfd === currentCfd),
    [currentCfd, formations]
  );

  const getLibelleTerritoire = (
    territoires?: Array<{ label: string; value: string }>,
    code?: string
  ) => {
    if (scope?.value && scopeFilters)
      return _.find(territoires, (territoire) => territoire.value === code)
        ?.label;
    return undefined;
  };

  const handleOrder = (
    column: OrderFormationsTransformationStats["orderBy"]
  ) => {
    trackEvent("tableau-quadrant-intentions:ordre", {
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
              {`Passer en vue ${
                typeVue === "quadrant" ? "tableau" : "quadrant"
              }`}
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
                    libelleRegion:
                      scope?.type === ScopeEnum.region
                        ? getLibelleTerritoire(
                            scopeFilters?.regions,
                            scope.value
                          )
                        : undefined,
                    libelleAcademie:
                      scope?.type === ScopeEnum.academie
                        ? getLibelleTerritoire(
                            scopeFilters?.academies,
                            scope.value
                          )
                        : undefined,
                    libelleDepartement:
                      scope?.type === ScopeEnum.departement
                        ? getLibelleTerritoire(
                            scopeFilters?.departements,
                            scope.value
                          )
                        : undefined,
                  })),
                  {
                    libelleDiplome: "Formation",
                    cfd: "CFD",
                    libelleDispositif: "Dispositif",
                    tauxInsertion: "Taux d'emploi",
                    tauxPoursuite: "Taux de poursuite",
                    tauxPression: "Taux de pression",
                    placesOuvertes: "Places ouvertes",
                    placesFermees: "Places fermées",
                    positionQuadrant: "Position dans le quadrant",
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
              bg="blueecume.400_hover"
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
            <Box p="4" w="300px" bg="blueecume.975" mr="6">
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
                      rel="noreferrer"
                      href={createParametrizedUrl("/intentions/restitution", {
                        filters: {
                          rentreeScolaire: "2024",
                          cfd: [formation.cfd],
                          codeDispositif: [formation.dispositifId],
                          typeDemande: filters.type
                            ? filters.type === "ouverture"
                              ? ["ouverture_nette", "ouverture_compensation"]
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
                      formation.tauxPression ? formation?.tauxPression : "-"
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
                    Taux de poursuite d'études régional
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
                    (typeVue === "quadrant" ? (
                      <Quadrant
                        onClick={({ cfd }) => setFormationId(cfd)}
                        meanInsertion={stats?.tauxInsertion}
                        meanPoursuite={stats?.tauxPoursuite}
                        itemId={(formation) =>
                          formation.cfd + formation.dispositifId
                        }
                        data={formations?.map((formation) => ({
                          ...formation,
                          effectif: formation.differencePlaces,
                        }))}
                        itemColor={(formation) =>
                          formation.cfd === currentCfd ? "#fd3b4cb5" : undefined
                        }
                        effectifSizes={[
                          { max: 15, size: 6 },
                          { max: 60, size: 12 },
                          { max: 150, size: 20 },
                          { max: 100000, size: 30 },
                        ]}
                      />
                    ) : (
                      <TableQuadrant
                        formations={formations}
                        handleClick={setFormationId}
                        currentCfd={currentCfd}
                        order={order}
                        handleOrder={(column?: string) =>
                          handleOrder(
                            column as OrderFormationsTransformationStats["orderBy"]
                          )
                        }
                      />
                    ))}
                  {!formations && <Skeleton opacity="0.3" height="100%" />}
                </>
              </AspectRatio>
            </Box>
            <Box p="4" ml="6" bg="blueecume.975" w="200px">
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
                  <Radio value="eleve">
                    Élevé
                    <TooltipIcon
                      ml="3"
                      label="Formations pour lesquelles le taux de pression est supérieur ou égal à 1.3"
                    />
                  </Radio>
                  <Radio value="faible">
                    Bas
                    <TooltipIcon
                      ml="3"
                      label="Formations pour lesquelles le taux de pression est inférieur à 0.7"
                    />
                  </Radio>
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
