import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon as ChakraIcon,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";
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

const Loader = () => {
  return (
    <Flex
      minH={550}
      minW={700}
      w={"100%"}
      gap={6}
      direction={"row"}
      borderBottomRadius={4}
      borderTopRightRadius={4}
      borderLeftWidth={1}
    >
      <Grid templateColumns="repeat(3, 1fr)" gap={6} flex={1}>
        <GridItem colSpan={2} p={4} bgColor={"white"} minW={450}>
          <Skeleton opacity={0.3} h={"100%"} w={"100%"} />
        </GridItem>
        <GridItem colSpan={1} p={4} bgColor={"white"}>
          <Skeleton opacity={0.3} h={"100%"} w={"100%"} />
        </GridItem>
        <GridItem colSpan={1} p={4} bgColor={"white"}>
          <Skeleton opacity={0.3} h={"100%"} w={"100%"} />
        </GridItem>
        <GridItem colSpan={1} p={4} bgColor={"white"}>
          <Skeleton opacity={0.3} h={"100%"} w={"100%"} />
        </GridItem>
        <GridItem colSpan={1} p={4} bgColor={"white"}>
          <Skeleton opacity={0.3} h={"100%"} w={"100%"} />
        </GridItem>
      </Grid>
    </Flex>
  );
};

const DrapeauFrancaisIcon = ({ ...props }) => (
  <ChakraIcon boxSize={4} {...props}>
    <svg
      width="20"
      height="13"
      viewBox="0 0 20 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect x="0.951111" width="20" height="13" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_2362_2536"
            transform="matrix(0.00446964 0 0 0.00666667 -0.00283401 0)"
          />
        </pattern>
        <image
          id="image0_2362_2536"
          width="225"
          height="150"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  </ChakraIcon>
);

const Card = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <Flex
      direction={"column"}
      flex={1}
      backgroundColor="white"
      borderColor={"grey.900"}
      borderWidth="1px"
      borderRadius="4px"
      borderStyle="solid"
      padding="8px"
      alignItems="start"
      gap={4}
    >
      <Text
        color={"bluefrance.113"}
        fontSize="14px"
        fontWeight="500"
        lineHeight="24px"
        textTransform="uppercase"
      >
        {title}
      </Text>
      <Flex w={"100%"} h={"100%"}>
        {children}
      </Flex>
    </Flex>
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
  scopeCode,
  percentage,
  nationalPercentage = 0,
  objective,
  round = 1,
}: {
  icon?: React.ReactNode;
  label?: string;
  scopeCode?: string;
  percentage: number;
  nationalPercentage?: number;
  objective?: number;
  round?: number;
}) => {
  return (
    <Flex
      direction={"column"}
      alignItems="start"
      justifyContent="start"
      minWidth="200px"
      w={"100%"}
      gap={4}
    >
      <HStack>
        {icon}
        <Text fontSize="14px" fontWeight="700" lineHeight="20px">
          {label}
        </Text>
      </HStack>
      <Flex flex={1} direction={"column"} gap="16px" width="100%">
        <Text
          fontSize="32px"
          lineHeight="40px"
          fontWeight="700"
          color={"grey.50"}
        >
          {formatPercentage(percentage, round, "-")}
        </Text>
        {objective && (
          <Box width="100%">
            <ProgressBar
              percentage={formatPercentageWithoutSign(
                percentage / objective,
                1
              )}
            />
            <Text color={themeDefinition.colors.grey[425]}>
              {formatPercentage(percentage / objective, 1)} de l'objectif
            </Text>
          </Box>
        )}
        {scopeCode && (
          <Flex direction={"row"} mt={"auto"} ms={"auto"} gap={2}>
            <Flex mt={1.5}>
              <DrapeauFrancaisIcon />
            </Flex>
            <Text
              fontSize="14px"
              lineHeight="20px"
              color={
                percentage - nationalPercentage > 0
                  ? "success.425"
                  : "error.425"
              }
              mb={"auto"}
            >
              {`${
                percentage - nationalPercentage > 0 ? "+" : ""
              }${formatPercentageWithoutSign(
                percentage - nationalPercentage,
                1
              )} pts`}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
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
      flex={1}
      w={"100%"}
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
      <Text fontSize="32px" fontWeight="800" color="grey.50">
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
  isLoading,
}: {
  data?: StatsPilotageIntentions;
  filters: FiltersStatsPilotageIntentions;
  isLoading?: boolean;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const { code } = useScopeCode(filters);

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

  const shouldShowProjetDemande = () =>
    filters.statut === undefined ||
    filters.statut.length === 0 ||
    filters.statut.includes(DemandeStatutEnum["projet de demande"]);

  const shouldShowDemandeValidee = () =>
    filters.statut === undefined ||
    filters.statut.length === 0 ||
    filters.statut.includes(DemandeStatutEnum["demande validée"]);

  if (isLoading) return <Loader />;

  return (
    <Flex flex="1" direction={"column"} gap={6}>
      <Flex direction={"row"} gap={6}>
        <Card title="Taux de transformation (Prévisionnel)">
          <Grid
            templateColumns="repeat(2, 1fr)"
            width="100%"
            minW={450}
            gap="24px"
          >
            {shouldShowProjetDemande() && (
              <GridItem colSpan={shouldShowDemandeValidee() ? 1 : 2}>
                <NumberWithLabel
                  label="Projets"
                  icon={<Icon icon="ri:file-text-line" />}
                  scopeCode={code}
                  percentage={getScopedData(
                    DemandeStatutEnum["projet de demande"],
                    "tauxTransformation"
                  )}
                  nationalPercentage={
                    nationalStats?.["projet de demande"]?.["_national"]
                      .tauxTransformation
                  }
                  objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
                />
              </GridItem>
            )}
            {shouldShowDemandeValidee() && (
              <GridItem colSpan={shouldShowProjetDemande() ? 1 : 2}>
                <NumberWithLabel
                  label="Demandes validées"
                  icon={<Icon icon="ri:checkbox-circle-line" />}
                  scopeCode={code}
                  percentage={getScopedData(
                    DemandeStatutEnum["demande validée"],
                    "tauxTransformation"
                  )}
                  nationalPercentage={
                    nationalStats?.["demande validée"]?.["_national"]
                      .tauxTransformation
                  }
                  objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
                />
              </GridItem>
            )}
          </Grid>
        </Card>
        <Card title="Ratio de fermetures">
          <NumberWithLabel
            label=" "
            scopeCode={code}
            percentage={getScopedData("all", "ratioFermeture")}
            nationalPercentage={
              nationalStats?.all?.["_national"].ratioFermeture
            }
          />
        </Card>
      </Flex>
      <Flex direction={"row"} gap={6}>
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
                  1,
                  "-"
                )}
              </Text>
              <Flex direction={"row"} gap={2}>
                <Text>places en Q1 / Q2</Text>
                <TooltipIcon
                  label={
                    <Flex direction="column" gap={4}>
                      <Text>
                        Positionnement du point de la formation dans le quadrant
                        par rapport aux moyennes régionales des taux d'emploi et
                        de poursuite d'études appliquées au niveau de diplôme.
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
                    getScopedData("all", "placesFermees"),
                  1,
                  "-"
                )}
              </Text>
              <Flex direction={"row"} gap={2}>
                <Text>places en Q3 / Q4</Text>
                <TooltipIcon
                  label={
                    <Flex direction="column" gap={4}>
                      <Text>
                        Positionnement du point de la formation dans le quadrant
                        par rapport aux moyennes régionales des taux d'emploi et
                        de poursuite d'études appliquées au niveau de diplôme.
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
                    Dans Orion, à partir de la campagne 2024, on désigne comme
                    “Colorations” le fait de colorer des places existantes sans
                    augmentation de capacité.
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
                  1,
                  "-"
                )}
              </Text>
              <Flex direction={"row"} gap={2}>
                <Text>places en Q3 / Q4</Text>
                <TooltipIcon
                  label={
                    <Flex direction="column" gap={4}>
                      <Text>
                        Positionnement du point de la formation dans le quadrant
                        par rapport aux moyennes régionales des taux d'emploi et
                        de poursuite d'études appliquées au niveau de diplôme.
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
      </Flex>
    </Flex>
  );
};
