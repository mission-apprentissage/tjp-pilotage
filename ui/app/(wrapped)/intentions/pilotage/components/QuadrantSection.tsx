import { ViewIcon } from "@chakra-ui/icons";
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
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import _ from "lodash";
import NextLink from "next/link";
import { usePlausible } from "next-plausible";
import { useMemo, useState } from "react";
import { ScopeEnum } from "shared";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";
import { Quadrant } from "@/components/Quadrant";
import { TableQuadrant } from "@/components/TableQuadrant";
import { TooltipIcon } from "@/components/TooltipIcon";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { useStateParams } from "@/utils/useFilters";

import {
  FiltersStatsPilotageIntentions,
  OrderFormationsPilotageIntentions,
  SelectedScope,
  StatsPilotageIntentions,
} from "../types";

const EFFECTIF_SIZES = [
  { max: 15, size: 6 },
  { max: 80, size: 14 },
  { max: 150, size: 18 },
  { max: 350, size: 22 },
  { max: 10000000, size: 30 },
];

const generateRestitutionUrl = (
  cfd: string,
  dispositifId?: string,
  scope?: SelectedScope,
  filters?: {
    tauxPression?: "faible" | "eleve";
    statut?: Extract<DemandeStatutType, "demande validée" | "proposition">;
    type?: "ouverture" | "fermeture";
    order?: Partial<OrderFormationsPilotageIntentions>;
  }
) => {
  const urlFilters: Record<string, unknown> = {
    rentreeScolaire: "2024",
    cfd: [cfd],
    codeDispositif: [dispositifId],
  };

  if (filters?.type) {
    if (filters.type === "ouverture") {
      urlFilters.typeDemande = ["ouverture_nette", "ouverture_compensation"];
    } else {
      urlFilters.typeDemande = ["fermeture", "diminution"];
    }
  }

  if (scope?.value !== undefined) {
    if (scope?.type === "region") {
      urlFilters.codeRegion = [scope.value];
    }

    if (scope?.type === "academie") {
      urlFilters.codeAcademie = [scope.value];
    }

    if (scope?.type === "departement") {
      urlFilters.codeDepartement = [scope.value];
    }
  }

  return createParametrizedUrl("/intentions/restitution", {
    filters: urlFilters,
  });
};

export const QuadrantSection = ({
  scope,
  parentFilters,
  scopeFilters,
}: {
  scope?: SelectedScope;
  parentFilters: Partial<FiltersStatsPilotageIntentions>;
  scopeFilters?: StatsPilotageIntentions["filters"];
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
      statut: undefined,
      type: undefined,
      order: undefined,
    } as {
      tauxPression?: "eleve" | "faible";
      statut?: Extract<DemandeStatutType, "demande validée" | "proposition">;
      type?: "ouverture" | "fermeture";
      order?: Partial<OrderFormationsPilotageIntentions>;
    },
  });

  const order = filters.order;

  const [currentFormationId, setCurrentFormationId] = useState<
    string | undefined
  >();
  const { ...otherFilters } = parentFilters;
  const mergedFilters = {
    ...otherFilters,
    tauxPression: filters.tauxPression,
    statut: filters.statut,
    type: filters.type,
    codeRegion: scope?.type === ScopeEnum.region ? scope.value : undefined,
    codeAcademie: scope?.type === ScopeEnum.academie ? scope.value : undefined,
    codeDepartement:
      scope?.type === ScopeEnum.departement ? scope.value : undefined,
  };

  const { data: { formations, stats } = {} } = client
    .ref("[GET]/pilotage-intentions/formations")
    .useQuery(
      {
        query: {
          ...mergedFilters,
          ...order,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 100000000,
      }
    );

  const formation = useMemo(
    () =>
      formations?.find(
        (item) => `${item.cfd}_${item.codeDispositif}` === currentFormationId
      ),
    [currentFormationId, formations]
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
    column: OrderFormationsPilotageIntentions["orderBy"]
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
          <Flex align="center" gap={6}>
            <Heading fontSize="md" mr="auto" color="bluefrance.113">
              RÉPARTITION DES OFFRES DE FORMATIONS TRANSFORMÉES
            </Heading>
            <Button onClick={() => toggleTypeVue()} variant="solid">
              <ViewIcon mr={2}></ViewIcon>
              {`Passer en vue ${
                typeVue === "quadrant" ? "tableau" : "quadrant"
              }`}
            </Button>
            <Flex>
              <ExportMenuButton
                sx={{
                  display:
                    "none" /* Le boutton Exporter est désactivé tant qu'il n'y a pas eu l'harmonisation des données */,
                }}
                onExportCsv={async () => {
                  if (!formations) return;
                  downloadCsv(
                    "formations_transformees",
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
                      libelleFormation: "Formation",
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
                onExportExcel={async () => {
                  if (!formations) return;
                  downloadExcel(
                    "formations_transformees",
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
                      libelleFormation: "Formation",
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
                variant="solid"
              />
            </Flex>
            <Select
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
                    value={formation?.libelleFormation}
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
                      href={generateRestitutionUrl(
                        formation.cfd,
                        formation?.codeDispositif,
                        scope,
                        filters
                      )}
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
              <Flex justify={"space-between"} flex={1}>
                <Flex>
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
                        const total = placesOuvertes + placesFermees;
                        return acc + (total ?? 0);
                      },
                      0
                    ) ?? "-"}{" "}
                    places
                  </Text>
                </Flex>
                <Flex>
                  <Popover>
                    <PopoverTrigger>
                      <Flex cursor="pointer">
                        <Icon
                          icon="ri:eye-line"
                          color="grey.425"
                          width={"14px"}
                        />
                        <Text
                          ms={2}
                          color="grey.425"
                          textDecoration={"underline"}
                          lineHeight={"14px"}
                        >
                          Légende
                        </Text>
                      </Flex>
                    </PopoverTrigger>
                    <PopoverContent
                      _focusVisible={{ outline: "none" }}
                      p="3"
                      minW={"sm"}
                    >
                      <>
                        <PopoverCloseButton />
                        <InfoTooltipContent />
                      </>
                    </PopoverContent>
                  </Popover>
                </Flex>
              </Flex>
              <AspectRatio flex={1} ratio={1}>
                <>
                  {formations &&
                    (typeVue === "quadrant" ? (
                      <Quadrant
                        onClick={({ cfd, codeDispositif }) =>
                          setCurrentFormationId(`${cfd}_${codeDispositif}`)
                        }
                        meanInsertion={stats?.tauxInsertion}
                        meanPoursuite={stats?.tauxPoursuite}
                        currentFormationId={currentFormationId}
                        data={formations?.map((formation) => ({
                          ...formation,
                          codeDispositif: formation.codeDispositif ?? "",
                          effectif: formation.differencePlaces,
                        }))}
                        effectifSizes={EFFECTIF_SIZES}
                      />
                    ) : (
                      <TableQuadrant
                        formations={formations?.map((formation) => ({
                          ...formation,
                          effectif: formation.differencePlaces,
                        }))}
                        handleClick={setCurrentFormationId}
                        currentFormationId={currentFormationId}
                        order={order}
                        handleOrder={(column?: string) =>
                          handleOrder(
                            column as OrderFormationsPilotageIntentions["orderBy"]
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
                      statut: (v || undefined) as
                        | Extract<
                            DemandeStatutType,
                            "demande validée" | "proposition"
                          >
                        | undefined,
                    })
                  }
                  value={filters.statut ?? ""}
                >
                  <Radio value="">Toutes</Radio>
                  <Radio value={DemandeStatutEnum["demande validée"]}>
                    Validées
                  </Radio>
                  <Radio value={DemandeStatutEnum["proposition"]}>
                    Projets
                  </Radio>
                </RadioGroup>
              </FormControl>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

const InfoTooltipContent = () => (
  <Box minW={"md"}>
    <Text mt="4" mb="2" fontSize="sm" fontWeight="bold">
      Légende:
    </Text>
    <VStack align="flex-start" spacing={2}>
      {EFFECTIF_SIZES.map(({ max, size }, i) => (
        <Flex key={max} align="center">
          <Box
            borderRadius={100}
            width={`${size}px`}
            height={`${size}px`}
            mx={`${28 - size / 2}`}
            border="1px solid black"
          />
          <Text flex={1} ml="4" fontSize="sm">
            {max !== 10000000 && (
              <>
                Nombre de places changées {"<"} {max}
              </>
            )}
            {max === 10000000 && (
              <>
                Nombre de places changées {">"} {EFFECTIF_SIZES[i - 1].max}
              </>
            )}
          </Text>
        </Flex>
      ))}
    </VStack>
  </Box>
);
