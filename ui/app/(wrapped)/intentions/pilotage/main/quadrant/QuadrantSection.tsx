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
import { CURRENT_RENTREE, ScopeEnum } from "shared";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import QuadrantPlaceholder from "@/app/(wrapped)/intentions/pilotage/components/QuadrantPlaceholder";
import type {
  Filters,
  FiltersPilotageIntentions,
  OrderQuadrantPilotageIntentions,
  PilotageIntentions,
  SelectedScope,
} from "@/app/(wrapped)/intentions/pilotage/types";
import { InfoTooltipContent } from "@/app/(wrapped)/panorama/components/QuadrantSection/InfoTooltipContent";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";
import { Quadrant } from "@/components/Quadrant";
import { TableBadge } from "@/components/TableBadge";
import { TableQuadrant } from "@/components/TableQuadrant";
import { TooltipIcon } from "@/components/TooltipIcon";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatNumber } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { PlacesTransformeesParPositionQuadrantSection } from "./PlacesTransformeesParPositionQuadrantSection";

const EFFECTIF_SIZES = [
  { max: 15, size: 6 },
  { min: 15, max: 40, size: 10 },
  { min: 40, max: 80, size: 14 },
  { min: 80, max: 150, size: 18 },
  { min: 150, size: 22 },
];

export const QuadrantSection = ({
  orderQuadrant,
  scope,
  filters,
  filtersOptions,
  setFilters,
  setSearchParams,
  data,
}: {
  orderQuadrant: Partial<OrderQuadrantPilotageIntentions>;
  scope?: SelectedScope;
  filters: FiltersPilotageIntentions;
  filtersOptions?: Filters;
  setFilters: (filters: FiltersPilotageIntentions) => void;
  setSearchParams: (params: { orderQuadrant?: Partial<OrderQuadrantPilotageIntentions> }) => void;
  data?: PilotageIntentions;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const bluefrance113 = useToken("colors", "bluefrance.113");
  const trackEvent = usePlausible();
  const [typeVue, setTypeVue] = useState<"quadrant" | "tableau">("quadrant");

  const toggleTypeVue = () => {
    if (typeVue === "quadrant") setTypeVue("tableau");
    else setTypeVue("quadrant");
  };

  const [currentFormationId, setCurrentFormationId] = useState<string | undefined>();
  const mergedFilters = {
    ...filters,
    codeRegion: scope?.type === ScopeEnum["région"] ? scope.value : undefined,
    codeAcademie: scope?.type === ScopeEnum["académie"] ? scope.value : undefined,
    codeDepartement: scope?.type === ScopeEnum["département"] ? scope.value : undefined,
  };

  const formationsQuadrant =
    data?.formations?.filter(
      (formation) => formation.tauxInsertion && formation.tauxPoursuite && formation.placesTransformees
    ) ?? [];

  const formation = useMemo(
    () => data?.formations?.find((item) => `${item.cfd}_${item.codeDispositif}` === currentFormationId),
    [currentFormationId, data]
  );

  const getLibelleTerritoire = (territoires?: Array<{ label: string; value: string }>, code?: string) => {
    if (scope?.value) return _.find(territoires, (territoire) => territoire.value === code)?.label;
    return undefined;
  };

  const handleOrder = (column: OrderQuadrantPilotageIntentions["orderByQuadrant"]) => {
    trackEvent("tableau-quadrant-intentions:ordre", {
      props: { colonne: column },
    });
    if (orderQuadrant?.orderByQuadrant !== column) {
      setSearchParams({ orderQuadrant: { orderQuadrant: "desc", orderByQuadrant: column } });
      return;
    }
    setSearchParams({
      ...filters,
      orderQuadrant: {
        orderQuadrant: orderQuadrant?.orderQuadrant === "asc" ? "desc" : "asc",
        orderByQuadrant: column,
      },
    });
  };

  const trackRestitutionsLink = () => {
    trackEvent("pilotage-transformation:quadrant-link-restitution");
  };

  const trackRestitutionsLinkFromQuadrantSelection = () => {
    trackEvent("pilotage-transformation:quadrant-link-restitution-from-selection");
  };

  const shouldShowQuadrant = !(
    (!mergedFilters.codeDepartement && !mergedFilters.codeAcademie && !mergedFilters.codeRegion) ||
    !mergedFilters.codeNiveauDiplome ||
    mergedFilters.codeNiveauDiplome.length === 0 ||
    mergedFilters.codeNiveauDiplome.length > 1
  );

  const generateRestitutionUrl = (cfd: string, dispositifId?: string) => {
    const urlFilters: Record<string, unknown> = {
      campagne: mergedFilters.campagne ?? undefined,
      rentreeScolaire: mergedFilters.rentreeScolaire ?? CURRENT_RENTREE,
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

    return createParameterizedUrl("/intentions/restitution", {
      filters: urlFilters,
    });
  };

  return (
    <Box width={"100%"}>
      <Box p="8" mx={"auto"}>
        <Flex align="center" gap={6}>
          <Heading fontSize={20} mr="auto">
            Places transformées par section du quadrant
          </Heading>
          <ExportMenuButton
            color={"bluefrance.113"}
            onExportCsv={async () => {
              downloadCsv(`repartition_par_position_quadrant`, Object.values(data?.positionsQuadrant ?? {}), {
                libelle: "Position quadrant",
                code: "Code",
                effectif: "Effectif",
                placesTransformees: "Places transformées",
                tauxTransformation: "Taux de transformation",
                placesOuvertes: "Places ouvertes",
                placesFermees: "Places fermées",
                placesColoreesOuvertes: "Places colorées ouvertes",
                placesColoreesFermees: "Places colorées fermées",
                solde: "Solde",
                ratioFermeture: "Ratio de fermeture",
              });
            }}
            onExportExcel={async () => {
              downloadExcel(`repartition_par_position_quadrant`, Object.values(data?.positionsQuadrant ?? {}), {
                libelle: "Position quadrant",
                code: "Code",
                effectif: "Effectif",
                placesTransformees: "Places transformées",
                tauxTransformation: "Taux de transformation",
                placesOuvertes: "Places ouvertes",
                placesFermees: "Places fermées",
                placesColoreesOuvertes: "Places colorées ouvertes",
                placesColoreesFermees: "Places colorées fermées",
                solde: "Solde",
                ratioFermeture: "Ratio de fermeture",
              });
            }}
            variant="ghost"
          />
        </Flex>
        <Divider my="4" mb={6} bgColor={"grey.900"} />
        <Flex mt={12} width="80%" mx={"auto"}>
          <PlacesTransformeesParPositionQuadrantSection
            formations={data?.formations}
            positionsQuadrant={data?.positionsQuadrant}
          />
        </Flex>
      </Box>
      <Box ms={8}>
        <Link
          as={NextLink}
          target="_blank"
          rel="noreferrer"
          href={createParameterizedUrl("/intentions/restitution", {
            filters: {
              codeNiveauDiplome: mergedFilters.codeNiveauDiplome,
              codeRegion: [mergedFilters.codeRegion],
              codeAcademie: [mergedFilters.codeAcademie],
              codeDepartement: [mergedFilters.codeDepartement],
              rentreeScolaire: mergedFilters.rentreeScolaire?.[0],
              campagne: mergedFilters.campagne,
              codeNsf: mergedFilters.codeNsf,
              statut: mergedFilters.statut,
              secteur:
                mergedFilters.secteur && mergedFilters.secteur?.length === 1 ? mergedFilters.secteur[0] : undefined,
            },
          })}
          color={"bluefrance.113"}
          onClick={() => trackRestitutionsLink()}
        >
          Voir la liste des demandes de transformation correspondantes
          <ArrowForwardIcon ms={2} />
        </Link>
      </Box>
      {shouldShowQuadrant ? (
        <Flex gap={6} direction="column" p={8}>
          <Flex direction="row" justify="space-between" gap={4} flex={1}>
            <Heading fontSize={20}>Quadrant des formations</Heading>
            <Flex direction={"row"} gap={4}>
              <ExportMenuButton
                onExportCsv={async () => {
                  if (!data?.formations) return;
                  downloadCsv(
                    "formations_transformees",
                    data?.formations.map((formation) => ({
                      ...formation,
                      libelleRegion:
                        scope?.type === ScopeEnum["région"]
                          ? getLibelleTerritoire(filtersOptions?.regions, scope.value)
                          : undefined,
                      libelleAcademie:
                        scope?.type === ScopeEnum["académie"]
                          ? getLibelleTerritoire(filtersOptions?.academies, scope.value)
                          : undefined,
                      libelleDepartement:
                        scope?.type === ScopeEnum["département"]
                          ? getLibelleTerritoire(filtersOptions?.departements, scope.value)
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
                  if (!data?.formations) return;
                  downloadExcel(
                    "formations_transformees",
                    data?.formations.map((formation) => ({
                      ...formation,
                      libelleRegion:
                        scope?.type === ScopeEnum["région"]
                          ? getLibelleTerritoire(filtersOptions?.regions, scope.value)
                          : undefined,
                      libelleAcademie:
                        scope?.type === ScopeEnum["académie"]
                          ? getLibelleTerritoire(filtersOptions?.academies, scope.value)
                          : undefined,
                      libelleDepartement:
                        scope?.type === ScopeEnum["département"]
                          ? getLibelleTerritoire(filtersOptions?.departements, scope.value)
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
                variant="ghost"
              />
              <Select
                variant="newInput"
                maxW={250}
                value={filters.type ?? ""}
                onChange={(item) => {
                  trackEvent("pilotage-transformation:quadrant-filter", {
                    props: {
                      type: "type",
                      value: item.target.value,
                    },
                  });

                  setFilters({
                    ...filters,
                    type: (item.target.value || undefined) as typeof filters.type,
                  });
                }}
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
                  Colorations
                </option>
              </Select>
            </Flex>
          </Flex>
          <Divider />
          <Flex mt="4">
            <Box p="4" mr="6" w="200px">
              <Heading mb="6" fontSize={14} fontWeight={500} color={"bluefrance.113"}>
                FILTRES
              </Heading>
              <FormControl mb="6">
                <FormLabel>Taux de pression</FormLabel>
                <RadioGroup
                  as={Stack}
                  onChange={(v) => {
                    trackEvent("pilotage-transformation:quadrant-filter", {
                      props: {
                        type: "tauxPression",
                        value: v,
                      },
                    });

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
                          <Text>Formations pour lesquelles le taux de pression est supérieur ou égal à 1.3</Text>
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
                          <Text>Formations pour lesquelles le taux de pression est inférieur à 0.7</Text>
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
                      <PopoverContent _focusVisible={{ outline: "none" }} p="3" minW={"sm"}>
                        <>
                          <PopoverCloseButton />
                          <InfoTooltipContent />
                        </>
                      </PopoverContent>
                    </Popover>
                  </Flex>
                  <Flex>
                    <Button onClick={() => toggleTypeVue()} variant="link" gap={2}>
                      <Icon
                        icon={`${typeVue === "quadrant" ? "ri:table-2" : "ri:layout-grid-line"}`}
                        color={bluefrance113}
                        height={"14px"}
                      />
                      <Text color={bluefrance113} fontWeight={400} lineHeight={"14px"}>
                        {`Vue ${typeVue === "quadrant" ? "tableau" : "quadrant"}`}
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
                            if (filters.type === "fermeture") return acc + (placesFermees ?? 0);
                            if (filters.type === "ouverture") return acc + (placesOuvertes ?? 0);
                            const total = placesOuvertes + placesFermees;
                            return acc + (total ?? 0);
                          }, 0)
                          .toString() ?? "-",
                      ]}
                    >
                      {
                        `${formationsQuadrant?.length ?? "-"} certifications -
                        ${formationsQuadrant?.reduce((acc, { placesTransformees }) => acc + (placesTransformees ?? 0), 0)
                        ?? "-"} places transformées`
                      }
                    </Highlight>
                  </Text>
                </Flex>
              </Flex>
              <AspectRatio flex={1} ratio={1}>
                <>
                  {data?.formations &&
                    (typeVue === "quadrant" ? (
                      <Quadrant
                        onClick={({ cfd, codeDispositif }) => setCurrentFormationId(`${cfd}_${codeDispositif}`)}
                        meanInsertion={data?.stats?.tauxInsertion}
                        meanPoursuite={data?.stats?.tauxPoursuite}
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
                        order={{ order: orderQuadrant.orderQuadrant, orderBy: orderQuadrant.orderByQuadrant }}
                        handleOrder={(column?: string) =>
                          handleOrder(column as OrderQuadrantPilotageIntentions["orderByQuadrant"])
                        }
                      />
                    ))}
                  {!data?.formations && <Skeleton opacity="0.3" height="100%" />}
                </>
              </AspectRatio>
            </Box>
            <Box p="4" w="250px" ml="6">
              <Heading size="sm" mb="6" color="bluefrance.113">
                DÉTAILS SUR LA FORMATION
              </Heading>
              {!formation && (
                <Text color="gray.500">Cliquez sur un point pour afficher le détail de la formation.</Text>
              )}

              {formation && (
                <Flex direction="column" gap={4}>
                  <InfoBlock fontSize={12} label="Formation concernée" value={formation?.libelleFormation} />
                  <InfoBlock fontSize={12} label="Dispositif" value={formation?.libelleDispositif} />
                  <Flex gap={6}>
                    {(!filters.type || filters.type === "ouverture") && (
                      <InfoBlock flex={1} fontSize={12} label={"Pl. ouvertes"} value={formation?.placesOuvertes ?? 0} />
                    )}
                    {(!filters.type || filters.type === "fermeture") && (
                      <InfoBlock flex={1} fontSize={12} label={"Pl. fermées"} value={formation?.placesFermees ?? 0} />
                    )}
                    {(!filters.type || filters.type === "fermeture") && (
                      <InfoBlock
                        flex={1}
                        fontSize={12}
                        label={"Pl. colorées ouvertes"}
                        value={formation?.placesColoreesOuvertes ?? 0}
                      />
                    )}
                    {(!filters.type || filters.type === "fermeture") && (
                      <InfoBlock
                        flex={1}
                        fontSize={12}
                        label={"Pl. colorées fermées"}
                        value={formation?.placesColoreesFermees ?? 0}
                      />
                    )}
                  </Flex>
                  <InfoBlock fontSize={12} label="Établissements concernés" value={formation?.nbEtablissements} />
                  <Button
                    fontSize={14}
                    fontWeight={500}
                    color={bluefrance113}
                    variant={"secondary"}
                    rightIcon={<ArrowForwardIcon />}
                    as={NextLink}
                    target="_blank"
                    rel="noreferrer"
                    href={generateRestitutionUrl(formation.cfd, formation?.codeDispositif)}
                    mb={4}
                    onClick={() => trackRestitutionsLinkFromQuadrantSelection()}
                  >
                    Voir le détail des demandes
                  </Button>
                  <InfoBlock
                    fontSize={12}
                    label="Taux de pression"
                    textBg="white"
                    value={
                      <TableBadge sx={getTauxPressionStyle(formation?.tauxPression)}>
                        {formation.tauxPression !== undefined ? formatNumber(formation?.tauxPression, 2) : "-"}
                      </TableBadge>
                    }
                  />
                  <Flex direction="column" width="100%">
                    <Text fontSize={12}>Taux d'emploi régional</Text>
                    <GraphWrapper w="100%" continuum={formation.continuum} value={formation.tauxInsertion} />
                  </Flex>
                  <Flex direction="column" width="100%">
                    <Text fontSize={12}>Taux de poursuite d'études régional</Text>
                    <GraphWrapper w="100%" continuum={formation.continuum} value={formation.tauxPoursuite} />
                  </Flex>
                  {formation.tauxDevenirFavorable && (
                    <Flex direction="column" width="100%">
                      <Text fontSize={12}>Taux de devenir favorable régional</Text>
                      <GraphWrapper w="100%" continuum={formation.continuum} value={formation.tauxDevenirFavorable} />
                    </Flex>
                  )}
                </Flex>
              )}
            </Box>
          </Flex>
        </Flex>
      ) : (
        <QuadrantPlaceholder />
      )}
    </Box>
  );
};
