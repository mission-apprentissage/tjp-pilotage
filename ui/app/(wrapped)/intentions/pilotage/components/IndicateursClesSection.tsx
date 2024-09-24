import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { ScopeEnum } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { OBJECTIF_TAUX_TRANSFO_PERCENTAGE } from "shared/objectives/TAUX_TRANSFO";

import { client } from "@/api.client";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { ProgressBar } from "@/components/ProgressBar";
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeDefinition } from "@/theme/theme";
import { themeColors } from "@/theme/themeColors";
import {
  formatPercentage,
  formatPercentageWithoutSign,
} from "@/utils/formatUtils";

import { useScopeCode } from "../hooks";
import {
  FiltersStatsPilotageIntentions,
  Indicateur,
  StatsPilotageIntentions,
  Statut,
} from "../types";
import { CartoSection, IndicateurType } from "./Carto";

const Card = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <VStack
      height="100%"
      width="100%"
      backgroundColor="white"
      borderColor={themeDefinition.colors.grey[900]}
      borderWidth="1px"
      borderRadius="4px"
      borderStyle="solid"
      padding="8px"
      alignItems="start"
    >
      <Text
        color={themeDefinition.colors.bluefrance[113]}
        fontSize="14px"
        fontWeight="500"
        lineHeight="24px"
        textTransform="uppercase"
      >
        {title}
      </Text>
      <Box flex="1">{children}</Box>
    </VStack>
  );
};

function generateGetScopedData(
  code: string | undefined,
  data?: StatsPilotageIntentions
) {
  return (statut: Statut, indicateur: Indicateur): number => {
    if (!code) return 0;
    return (data?.[statut]?.[`_${code}`]?.[indicateur] as number) ?? 0;
  };
}

const NumberWithLabel = ({
  icon,
  label,
  percentage,
  objective,
  round = 1,
}: {
  icon?: React.ReactNode;
  label?: string;
  percentage: number;
  objective?: number;
  round?: number;
}) => {
  return (
    <VStack alignItems="start" justifyContent="start" minWidth="200px">
      <HStack>
        {icon}
        <Text fontSize="12px" fontWeight="700" lineHeight="20px">
          {label}
        </Text>
      </HStack>
      <VStack gap="16px" width="100%" alignItems="start">
        <Text fontSize="32px" lineHeight="40px" fontWeight="700">
          {percentage === 0 ? "-" : formatPercentage(percentage, round)}
        </Text>
        {objective && (
          <Box width="100%">
            <ProgressBar
              percentage={formatPercentageWithoutSign(percentage / objective)}
            />
            <Text color={themeDefinition.colors.grey[425]}>
              {formatPercentage(percentage / objective, 0)} de l'objectif
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
};

const NumberWithProgressBars = ({
  all,
  demandeValidee,
  projetDeDemande,
  title,
  icon,
  tooltip,
  children,
}: {
  all: number;
  demandeValidee: number;
  projetDeDemande: number;
  title: string;
  icon?: React.ReactNode;
  tooltip?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <Flex
      flexDirection={"column"}
      gap="8px"
      backgroundColor="white"
      borderRadius={4}
      padding="8px"
      borderColor={themeDefinition.colors.grey[900]}
      borderWidth="1px"
      borderStyle="solid"
    >
      <HStack width="100%" justifyContent="start" alignItems="start">
        {icon}
        <Text
          pb="8px"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="24px"
          textTransform="uppercase"
          color={themeColors.bluefrance[113]}
        >
          {title}
        </Text>
        {tooltip}
      </HStack>
      <Text fontSize="40px" fontWeight="800" color="bluefrance.113">
        {all}
      </Text>
      <ProgressBar
        percentage={formatPercentageWithoutSign(demandeValidee / all)}
        rightLabel="Validées"
        leftLabel={demandeValidee}
        colorScheme={themeColors.success[975]}
      />
      <ProgressBar
        percentage={formatPercentageWithoutSign(projetDeDemande / all)}
        rightLabel="En projet"
        leftLabel={projetDeDemande}
        colorScheme={themeColors.orange.draft}
      />
      {children}
    </Flex>
  );
};

export const IndicateursClesSection = ({
  data,
  filters,
  setFilters,
  onOpenTauxTransfoDefinition,
}: {
  data?: StatsPilotageIntentions;
  filters: FiltersStatsPilotageIntentions;
  setFilters: (filters: FiltersStatsPilotageIntentions) => void;
  onOpenTauxTransfoDefinition: () => void;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const { code } = useScopeCode(filters);
  const [indicateur, setIndicateur] =
    useState<IndicateurType>("tauxTransformation");

  const { data: nationalStats } = client
    .ref("[GET]/pilotage-intentions/stats")
    .useQuery(
      {
        query: {
          ...filters,
          scope: ScopeEnum.national,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const getScopedData = useMemo(
    () =>
      code
        ? generateGetScopedData(code, data)
        : generateGetScopedData(ScopeEnum.national, nationalStats),
    [generateGetScopedData, data, code, nationalStats]
  );

  const indicateurOptions = [
    {
      label: "Taux de transformation",
      value: "tauxTransformation",
      isDefault: true,
    },
    {
      label: "Ratio de fermetures",
      value: "ratioFermeture",
      isDefault: false,
    },
  ];

  return (
    <VStack
      gap={8}
      width="100%"
      alignItems="start"
      color={themeDefinition.colors.grey[50]}
    >
      <Flex direction={"row"} gap={3}>
        <Text fontWeight="700" fontSize="20px" lineHeight="28px">
          Indicateurs clés de la transformation
        </Text>
        <TooltipIcon
          onClick={() => onOpenTauxTransfoDefinition()}
          label={
            <Flex direction="column" gap={4}>
              <Text>Comprendre le taux de transformation.</Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Flex>
          }
          my="auto"
        />
      </Flex>
      <Stack width="100%" h={"100%"} gap="16px" direction="row">
        <Grid flex="1" templateColumns="repeat(3, minmax(0, 1fr))" gap="16px">
          <GridItem colSpan={2}>
            <Card title="Taux de transformation (Prévisionnel)">
              <Grid
                templateColumns="repeat(2, minmax(0, 1fr))"
                width="100%"
                gap="24px"
              >
                <GridItem height="100%">
                  <NumberWithLabel
                    label="Projets"
                    icon={<Icon icon="ri:file-text-line" />}
                    percentage={getScopedData(
                      DemandeStatutEnum["projet de demande"],
                      "tauxTransformation"
                    )}
                    objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
                  />
                </GridItem>
                <GridItem height="100%">
                  <NumberWithLabel
                    label="Demandes validées"
                    icon={<Icon icon="ri:checkbox-circle-line" />}
                    percentage={getScopedData(
                      DemandeStatutEnum["demande validée"],
                      "tauxTransformation"
                    )}
                    objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
                  />
                </GridItem>
              </Grid>
            </Card>
          </GridItem>
          <GridItem height="100%">
            <Card title="Ratio de fermetures">
              <GridItem height="100%">
                <NumberWithLabel
                  label=" "
                  percentage={getScopedData("all", "ratioFermeture")}
                  round={0}
                />
              </GridItem>
            </Card>
          </GridItem>
          <GridItem height="100%">
            <NumberWithProgressBars
              all={getScopedData("all", "placesOuvertes")}
              icon={
                <Icon
                  width="24px"
                  icon="ri:user-add-fill"
                  color={themeDefinition.colors.bluefrance[525]}
                />
              }
              title="Pl. Ouvertes"
              demandeValidee={getScopedData(
                DemandeStatutEnum["demande validée"],
                "placesOuvertes"
              )}
              projetDeDemande={getScopedData(
                DemandeStatutEnum["projet de demande"],
                "placesOuvertes"
              )}
            >
              <Divider />
              <VStack
                width="100%"
                color={themeDefinition.colors.grey[425]}
                fontSize="12px"
              >
                <Text alignSelf="end">dont</Text>
                <HStack
                  justifyContent="space-between"
                  width="100%"
                  alignItems="start"
                >
                  <Text>
                    {formatPercentage(
                      getScopedData("all", "placesOuvertesQ1Q2") /
                        getScopedData("all", "placesOuvertes"),
                      0,
                      "-"
                    )}
                  </Text>
                  <Flex direction={"row"} gap={2}>
                    <Text>places en Q1 / Q2</Text>
                    <TooltipIcon
                      label={
                        <Flex direction="column" gap={4}>
                          <Text>
                            Positionnement du point de la formation dans le
                            quadrant par rapport aux moyennes régionales des
                            taux d'emploi et de poursuite d'études appliquées au
                            niveau de diplôme.
                          </Text>
                          <Text>Cliquez pour plus d'infos.</Text>
                        </Flex>
                      }
                      onClick={() => openGlossaire("quadrant")}
                      my={"auto"}
                    />
                  </Flex>
                </HStack>
              </VStack>
            </NumberWithProgressBars>
          </GridItem>
          <GridItem height="100%">
            <NumberWithProgressBars
              all={getScopedData("all", "placesFermees")}
              icon={
                <Icon
                  width="24px"
                  icon="ri:user-unfollow-fill"
                  color={themeDefinition.colors.success["425_active"]}
                />
              }
              title="Pl. Fermées"
              demandeValidee={getScopedData(
                DemandeStatutEnum["demande validée"],
                "placesFermees"
              )}
              projetDeDemande={getScopedData(
                DemandeStatutEnum["projet de demande"],
                "placesFermees"
              )}
            >
              <Divider />
              <VStack
                width="100%"
                color={themeDefinition.colors.grey[425]}
                fontSize="12px"
              >
                <Text alignSelf="end">dont</Text>
                <HStack
                  justifyContent="space-between"
                  width="100%"
                  alignItems="start"
                >
                  <Text>
                    {formatPercentage(
                      getScopedData("all", "placesFermeesQ3Q4") /
                        getScopedData("all", "placesFermees")
                    )}
                  </Text>
                  <Flex direction={"row"} gap={2}>
                    <Text>places en Q3 / Q4</Text>
                    <TooltipIcon
                      label={
                        <Flex direction="column" gap={4}>
                          <Text>
                            Positionnement du point de la formation dans le
                            quadrant par rapport aux moyennes régionales des
                            taux d'emploi et de poursuite d'études appliquées au
                            niveau de diplôme.
                          </Text>
                          <Text>Cliquez pour plus d'infos.</Text>
                        </Flex>
                      }
                      onClick={() => openGlossaire("quadrant")}
                      my={"auto"}
                    />
                  </Flex>
                </HStack>
              </VStack>
            </NumberWithProgressBars>
          </GridItem>
          <GridItem height="100%" flex={1}>
            <NumberWithProgressBars
              all={getScopedData("all", "placesColorees")}
              icon={
                <Icon
                  width="24px"
                  icon="ri:account-pin-box-fill"
                  color={themeDefinition.colors.purpleGlycine["850_active"]}
                />
              }
              title="Pl. Colorées"
              demandeValidee={getScopedData(
                DemandeStatutEnum["demande validée"],
                "placesColorees"
              )}
              projetDeDemande={getScopedData(
                DemandeStatutEnum["projet de demande"],
                "placesColorees"
              )}
              tooltip={
                <TooltipIcon
                  label={
                    <Box>
                      <Text>
                        Dans Orion, à partir de la campagne 2024, on désigne
                        comme “Colorations” le fait de colorer des places
                        existantes sans augmentation de capacité.
                      </Text>
                      <Text mt={4}>Cliquez pour plus d'infos.</Text>
                    </Box>
                  }
                  h={"24px"}
                  onClick={() => openGlossaire("coloration")}
                />
              }
            >
              <Divider />
              <VStack
                width="100%"
                color={themeDefinition.colors.grey[425]}
                fontSize="12px"
              >
                <Text alignSelf="end">dont</Text>
                <HStack
                  justifyContent="space-between"
                  width="100%"
                  alignItems="start"
                >
                  <Text>
                    {formatPercentage(
                      getScopedData("all", "placesColoreesQ3Q4") /
                        getScopedData("all", "placesColorees"),
                      0,
                      "-"
                    )}
                  </Text>
                  <Flex direction={"row"} gap={2}>
                    <Text>places en Q3 / Q4</Text>
                    <TooltipIcon
                      label={
                        <Flex direction="column" gap={4}>
                          <Text>
                            Positionnement du point de la formation dans le
                            quadrant par rapport aux moyennes régionales des
                            taux d'emploi et de poursuite d'études appliquées au
                            niveau de diplôme.
                          </Text>
                          <Text>Cliquez pour plus d'infos.</Text>
                        </Flex>
                      }
                      onClick={() => openGlossaire("quadrant")}
                      my={"auto"}
                    />
                  </Flex>
                </HStack>
              </VStack>
            </NumberWithProgressBars>
          </GridItem>
        </Grid>
        <Grid minW="500px">
          <CartoSection
            indicateur={indicateur}
            handleIndicateurChange={(newIndicateur) =>
              setIndicateur(newIndicateur as IndicateurType)
            }
            indicateurOptions={indicateurOptions}
            filters={filters}
            data={data}
            handleFilters={(f) => setFilters({ ...filters, ...f })}
          />
        </Grid>
      </Stack>
    </VStack>
  );
};
