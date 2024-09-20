import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Highlight,
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
  useToken,
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
import { PlacesTransformeesParPositionQuadrantSection } from "@/app/(wrapped)/intentions/pilotage/main/quadrant/PlacesTransformeesParPositionQuadrantSection";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";
import { Quadrant } from "@/components/Quadrant";
import { TableBadge } from "@/components/TableBadge";
import { TableQuadrant } from "@/components/TableQuadrant";
import { TooltipIcon } from "@/components/TooltipIcon";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatNumber } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";
import { useStateParams } from "@/utils/useFilters";

import { useGlossaireContext } from "../../../../glossaire/glossaireContext";
import QuadrantPlaceholder from "../../components/QuadrantPlaceholder";
import {
  FiltersStatsPilotageIntentions,
  OrderFormationsPilotageIntentions,
  SelectedScope,
  StatsPilotageIntentions,
} from "../../types";

const EFFECTIF_SIZES = [
  { max: 15, size: 6 },
  { min: 15, max: 40, size: 10 },
  { min: 40, max: 80, size: 14 },
  { min: 80, max: 150, size: 18 },
  { min: 150, size: 22 },
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
    if (scope?.type === ScopeEnum["région"]) {
      urlFilters.codeRegion = [scope.value];
    }

    if (scope?.type === ScopeEnum["académie"]) {
      urlFilters.codeAcademie = [scope.value];
    }

    if (scope?.type === ScopeEnum["département"]) {
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
  const { openGlossaire } = useGlossaireContext();
  const bluefrance113 = useToken("colors", "bluefrance.113");
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
    codeRegion: scope?.type === ScopeEnum["région"] ? scope.value : undefined,
    codeAcademie:
      scope?.type === ScopeEnum["académie"] ? scope.value : undefined,
    codeDepartement:
      scope?.type === ScopeEnum["département"] ? scope.value : undefined,
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

  const formationsQuadrant =
    formations?.filter(
      (formation) =>
        formation.tauxInsertion &&
        formation.tauxPoursuite &&
        formation.placesTransformees
    ) ?? [];

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

  if (
    (!mergedFilters.codeDepartement &&
      !mergedFilters.codeAcademie &&
      !mergedFilters.codeRegion) ||
    !mergedFilters.codeNiveauDiplome ||
    mergedFilters.codeNiveauDiplome.length === 0 ||
    mergedFilters.codeNiveauDiplome.length > 1
  ) {
    return <QuadrantPlaceholder />;
  }

  return (
    <>
      <Box width={"100%"}>
        <Box p="8">
          <Flex align="center" gap={6}>
            <Heading fontSize={20} mr="auto">
              Quadrant des formations
            </Heading>
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
                        scope?.type === ScopeEnum["région"]
                          ? getLibelleTerritoire(
                              scopeFilters?.regions,
                              scope.value
                            )
                          : undefined,
                      libelleAcademie:
                        scope?.type === ScopeEnum["académie"]
                          ? getLibelleTerritoire(
                              scopeFilters?.academies,
                              scope.value
                            )
                          : undefined,
                      libelleDepartement:
                        scope?.type === ScopeEnum["département"]
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
                        scope?.type === ScopeEnum["région"]
                          ? getLibelleTerritoire(
                              scopeFilters?.regions,
                              scope.value
                            )
                          : undefined,
                      libelleAcademie:
                        scope?.type === ScopeEnum["académie"]
                          ? getLibelleTerritoire(
                              scopeFilters?.academies,
                              scope.value
                            )
                          : undefined,
                      libelleDepartement:
                        scope?.type === ScopeEnum["département"]
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
                Toutes transformations
              </option>
              <option value="ouverture" style={{ color: "black" }}>
                Places ouvertes
              </option>
              <option value="fermeture" style={{ color: "black" }}>
                Places fermées
              </option>
              <option value="coloration" style={{ color: "black" }}>
                Places colorées
              </option>
            </Select>
          </Flex>
          <Divider my="4" />
          <Flex mt="4">
            <Box p="4" mr="6" w="200px">
              <Heading
                mb="6"
                fontSize={14}
                fontWeight={500}
                color={"bluefrance.113"}
              >
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
                  <Flex gap={2}>
                    <Radio value="eleve">Élevé</Radio>
                    <TooltipIcon
                      label={
                        <Box>
                          <Text>
                            Formations pour lesquelles le taux de pression est
                            supérieur ou égal à 1.3
                          </Text>
                          <Text mt={4}>Cliquez pour plus d'infos.</Text>
                        </Box>
                      }
                      onClick={() => {
                        openGlossaire("taux-de-pression");
                      }}
                      my={"auto"}
                    />
                  </Flex>
                  <Flex gap={2}>
                    <Radio value="faible">Bas</Radio>
                    <TooltipIcon
                      label={
                        <Box>
                          <Text>
                            Formations pour lesquelles le taux de pression est
                            inférieur à 0.7
                          </Text>
                          <Text mt={4}>Cliquez pour plus d'infos.</Text>
                        </Box>
                      }
                      onClick={() => {
                        openGlossaire("taux-de-pression");
                      }}
                      my={"auto"}
                    />
                  </Flex>
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

            <Box flex="1">
              <Flex direction="row" justify={"space-between"} mb={4}>
                <Flex gap={5}>
                  <Flex>
                    <Popover>
                      <PopoverTrigger>
                        <Button cursor="pointer" gap={2} variant="link">
                          <Icon icon="ri:eye-line" color={bluefrance113} />
                          <Text color="bluefrance.113" fontWeight={400}>
                            Légende
                          </Text>
                        </Button>
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
                  <Flex>
                    <Button
                      onClick={() => toggleTypeVue()}
                      variant="link"
                      gap={2}
                    >
                      <Icon
                        icon={`${
                          typeVue === "quadrant"
                            ? "ri:table-2"
                            : "ri:layout-grid-line"
                        }`}
                        color={bluefrance113}
                        height={"14px"}
                      />
                      <Text
                        color={bluefrance113}
                        fontWeight={400}
                        lineHeight={"14px"}
                      >
                        {`Vue ${
                          typeVue === "quadrant" ? "tableau" : "quadrant"
                        }`}
                      </Text>
                    </Button>
                  </Flex>
                </Flex>
                <Flex>
                  <Text color="grey" fontSize="sm" textAlign="left">
                    <Highlight
                      query={[
                        formationsQuadrant?.length.toString() ?? "-",
                        formationsQuadrant
                          ?.reduce((acc, { placesOuvertes, placesFermees }) => {
                            if (filters.type === "fermeture")
                              return acc + (placesFermees ?? 0);
                            if (filters.type === "ouverture")
                              return acc + (placesOuvertes ?? 0);
                            const total = placesOuvertes + placesFermees;
                            return acc + (total ?? 0);
                          }, 0)
                          .toString() ?? "-",
                      ]}
                    >
                      {`${formationsQuadrant?.length ?? "-"} certifications -
                        ${
                          formationsQuadrant?.reduce(
                            (acc, { placesTransformees }) =>
                              acc + (placesTransformees ?? 0),
                            0
                          ) ?? "-"
                        } places transformées`}
                    </Highlight>
                  </Text>
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
                        data={formationsQuadrant?.map((formation) => ({
                          ...formation,
                          codeDispositif: formation.codeDispositif ?? "",
                          effectif: formation.placesTransformees,
                          tauxInsertion: formation.tauxInsertion ?? 0,
                          tauxPoursuite: formation.tauxPoursuite ?? 0,
                        }))}
                        effectifSizes={EFFECTIF_SIZES}
                      />
                    ) : (
                      <TableQuadrant
                        formations={formationsQuadrant?.map((formation) => ({
                          ...formation,
                          effectif: formation.placesTransformees,
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
            <Box p="4" w="250px" ml="6">
              <Heading size="sm" mb="6" color="bluefrance.113">
                DÉTAILS SUR LA FORMATION
              </Heading>
              {!formation && (
                <Text color="gray.500">
                  Cliquez sur un point pour afficher le détail de la formation.
                </Text>
              )}

              {formation && (
                <Flex direction="column" gap={4}>
                  <InfoBlock
                    fontSize={12}
                    label="Formation concernée"
                    value={formation?.libelleFormation}
                  />
                  <InfoBlock
                    fontSize={12}
                    label="Dispositif"
                    value={formation?.libelleDispositif}
                  />
                  <Flex gap={6}>
                    {(!filters.type || filters.type === "ouverture") && (
                      <InfoBlock
                        flex={1}
                        fontSize={12}
                        label={"Pl. ouvertes"}
                        value={formation?.placesOuvertes ?? 0}
                      />
                    )}
                    {(!filters.type || filters.type === "fermeture") && (
                      <InfoBlock
                        flex={1}
                        fontSize={12}
                        label={"Pl. fermées"}
                        value={formation?.placesFermees ?? 0}
                      />
                    )}
                    {(!filters.type || filters.type === "fermeture") && (
                      <InfoBlock
                        flex={1}
                        fontSize={12}
                        label={"Pl. colorées"}
                        value={formation?.placesColorees ?? 0}
                      />
                    )}
                  </Flex>
                  <InfoBlock
                    fontSize={12}
                    label="Établissements concernés"
                    value={formation?.nbEtablissements}
                  />
                  <Button
                    fontSize={14}
                    fontWeight={500}
                    color={bluefrance113}
                    variant={"secondary"}
                    rightIcon={<ArrowForwardIcon />}
                    as={NextLink}
                    target="_blank"
                    rel="noreferrer"
                    href={generateRestitutionUrl(
                      formation.cfd,
                      formation?.codeDispositif,
                      scope,
                      filters
                    )}
                    mb={4}
                  >
                    Voir le détail des demandes
                  </Button>
                  <InfoBlock
                    fontSize={12}
                    label="Taux de pression"
                    textBg="white"
                    value={
                      <TableBadge
                        sx={getTauxPressionStyle(formation?.tauxPression)}
                      >
                        {formation.tauxPression !== undefined
                          ? formatNumber(formation?.tauxPression, 2)
                          : "-"}
                      </TableBadge>
                    }
                  />
                  <Flex direction="column" width="100%">
                    <Text fontSize={12}>Taux d'emploi régional</Text>
                    <GraphWrapper
                      w="100%"
                      continuum={formation.continuum}
                      value={formation.tauxInsertion}
                    />
                  </Flex>
                  <Flex direction="column" width="100%">
                    <Text fontSize={12}>
                      Taux de poursuite d'études régional
                    </Text>
                    <GraphWrapper
                      w="100%"
                      continuum={formation.continuum}
                      value={formation.tauxPoursuite}
                    />
                  </Flex>
                  {formation.tauxDevenirFavorable && (
                    <Flex direction="column" width="100%">
                      <Text fontSize={12}>
                        Taux de devenir favorable régional
                      </Text>
                      <GraphWrapper
                        w="100%"
                        continuum={formation.continuum}
                        value={formation.tauxDevenirFavorable}
                      />
                    </Flex>
                  )}
                </Flex>
              )}
            </Box>
          </Flex>
        </Box>
        <Box p="8" mx={"auto"}>
          <Flex align="center" gap={6}>
            <Heading fontSize={20} mr="auto">
              Places transformées par section du quadrant
            </Heading>
            <Button
              variant={"ghost"}
              color={"bluefrance.113"}
              leftIcon={<Icon icon="ri:download-line" />}
              as={Link}
              href={"__TODO__"}
              isDisabled
              target="_blank"
            >
              Exporter
            </Button>
          </Flex>
          <Divider my="4" mb={6} bgColor={"grey.900"} />
          <Flex mt={12} width="80%" mx={"auto"}>
            <PlacesTransformeesParPositionQuadrantSection
              formations={formations}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
};

const InfoTooltipContent = () => (
  <Box minW={"md"}>
    <Text mt="4" mb="2" fontSize="sm" fontWeight="bold">
      Nombre de places transformées :
    </Text>
    <Flex direction={"column"} align="flex-start" gap={2}>
      {EFFECTIF_SIZES.map(({ min, max, size }) => (
        <Flex key={`${min}_${max}_${size}`} align="center">
          <Box
            borderRadius={100}
            width={`${size}px`}
            height={`${size}px`}
            mx={`${22 - size / 2}`}
            border="1px solid black"
          />
          <Text flex={1} ml="4" fontSize="sm">
            {typeof min === "undefined" && (
              <>
                {"<"} {max} places transformées
              </>
            )}
            {typeof max === "undefined" && (
              <>
                {">"} {min} places transformées
              </>
            )}
            {typeof min !== "undefined" && typeof max !== "undefined" && (
              <>
                {min} à {max} places transformées
              </>
            )}
          </Text>
        </Flex>
      ))}
    </Flex>
  </Box>
);
