import { Box, Divider, Flex, Grid, GridItem, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { ScopeEnum } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { OBJECTIF_TAUX_TRANSFO_PERCENTAGE } from "shared/objectives/TAUX_TRANSFO";

import { client } from "@/api.client";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { IndicateurCard } from "@/app/(wrapped)/intentions/pilotage/components/IndicateurCard";
import { NumberWithLabel } from "@/app/(wrapped)/intentions/pilotage/components/NumberWithLabel";
import { NumberWithProgressBars } from "@/app/(wrapped)/intentions/pilotage/components/NumberWithProgressBars";
import { useScopeCode } from "@/app/(wrapped)/intentions/pilotage/hooks";
import type {
  FiltersStatsPilotageIntentions,
  Indicateur,
  StatsPilotageIntentions,
  Statut,
} from "@/app/(wrapped)/intentions/pilotage/types";
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeDefinition } from "@/theme/theme";
import { formatPercentage } from "@/utils/formatUtils";

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

const generateGetScopedData =
  (code: string | undefined, data?: StatsPilotageIntentions) =>
    (statut: Statut, indicateur: Indicateur): number => {
      if (!code) return 0;
      return data?.[statut]?.[`_${code}`]?.[indicateur] as number;
    };

export const IndicateursClesSection = ({
  data,
  filters,
  isLoading,
  onOpenTauxTransfoDefinition,
}: {
  data?: StatsPilotageIntentions;
  filters: FiltersStatsPilotageIntentions;
  isLoading?: boolean;
  onOpenTauxTransfoDefinition: () => void;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const { code } = useScopeCode(filters);

  const { data: nationalStats } = client.ref("[GET]/pilotage-intentions/stats").useQuery(
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
    () => (code ? generateGetScopedData(code, data) : generateGetScopedData(ScopeEnum.national, nationalStats)),
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

  if (isLoading || !filters.campagne || !filters.rentreeScolaire) return <Loader />;

  return (
    <Flex flex="1" direction={"column"} gap={6}>
      <Flex direction={"row"} gap={6}>
        <IndicateurCard
          title="Taux de transformation (Prévisionnel)"
          tooltip={
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
          }
        >
          <Grid templateColumns="repeat(2, 1fr)" width="100%" minW={450} gap="24px">
            {shouldShowProjetDemande() && (
              <GridItem colSpan={shouldShowDemandeValidee() ? 1 : 2}>
                <NumberWithLabel
                  label="Projets"
                  icon={<Icon icon="ri:file-text-line" />}
                  scopeCode={code}
                  percentage={getScopedData(DemandeStatutEnum["projet de demande"], "tauxTransformation")}
                  nationalPercentage={nationalStats?.["projet de demande"]?.["_national"].tauxTransformation}
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
                  percentage={getScopedData(DemandeStatutEnum["demande validée"], "tauxTransformation")}
                  nationalPercentage={nationalStats?.["demande validée"]?.["_national"].tauxTransformation}
                  objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
                />
              </GridItem>
            )}
          </Grid>
        </IndicateurCard>
        <IndicateurCard title="Ratio de fermetures">
          <NumberWithLabel
            label=" "
            scopeCode={code}
            percentage={getScopedData("all", "ratioFermeture")}
            nationalPercentage={nationalStats?.all?.["_national"].ratioFermeture}
          />
        </IndicateurCard>
      </Flex>
      <Flex direction={"row"} gap={6}>
        <NumberWithProgressBars
          all={getScopedData("all", "placesOuvertes")}
          icon={<Icon width="24px" icon="ri:user-add-fill" color={themeDefinition.colors.bluefrance[525]} />}
          title="Pl. Ouvertes"
          demandeValidee={getScopedData(DemandeStatutEnum["demande validée"], "placesOuvertes")}
          projetDeDemande={getScopedData(DemandeStatutEnum["projet de demande"], "placesOuvertes")}
        >
          <Divider />
          <VStack width="100%" color={themeDefinition.colors.grey[425]} fontSize="12px">
            <Text alignSelf="end">dont</Text>
            <HStack justifyContent="space-between" width="100%" alignItems="start">
              <Text>
                {formatPercentage(
                  getScopedData("all", "placesOuvertesQ1") / getScopedData("all", "placesOuvertes"),
                  1,
                  "-"
                )}
              </Text>
              <Flex direction={"row"} gap={2}>
                <Text>places en Q1</Text>
                <TooltipIcon
                  label={
                    <Flex direction="column" gap={4}>
                      <Text>
                        Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des
                        taux d'emploi et de poursuite d'études appliquées au niveau de diplôme.
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
          icon={<Icon width="24px" icon="ri:user-unfollow-fill" color={themeDefinition.colors.success["425_active"]} />}
          title="Pl. Fermées"
          demandeValidee={getScopedData(DemandeStatutEnum["demande validée"], "placesFermees")}
          projetDeDemande={getScopedData(DemandeStatutEnum["projet de demande"], "placesFermees")}
        >
          <Divider />
          <VStack width="100%" color={themeDefinition.colors.grey[425]} fontSize="12px">
            <Text alignSelf="end">dont</Text>
            <HStack justifyContent="space-between" width="100%" alignItems="start">
              <Text>
                {formatPercentage(
                  getScopedData("all", "placesFermeesQ4") / getScopedData("all", "placesFermees"),
                  1,
                  "-"
                )}
              </Text>
              <Flex direction={"row"} gap={2}>
                <Text>places en Q4</Text>
                <TooltipIcon
                  label={
                    <Flex direction="column" gap={4}>
                      <Text>
                        Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des
                        taux d'emploi et de poursuite d'études appliquées au niveau de diplôme.
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
          title="Colorations"
          demandeValidee={getScopedData(DemandeStatutEnum["demande validée"], "placesColorees")}
          projetDeDemande={getScopedData(DemandeStatutEnum["projet de demande"], "placesColorees")}
          tooltip={
            <TooltipIcon
              label={
                <Box>
                  <Text>
                    Dans Orion, à partir de la campagne 2024, on désigne comme “Colorations” le fait de colorer des
                    places existantes sans augmentation de capacité.
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
          <VStack width="100%" color={themeDefinition.colors.grey[425]} fontSize="12px">
            <Text alignSelf="end">dont</Text>
            <HStack justifyContent="space-between" width="100%" alignItems="start">
              <Text>
                {formatPercentage(
                  getScopedData("all", "placesColoreesQ4") / getScopedData("all", "placesColorees"),
                  1,
                  "-"
                )}
              </Text>
              <Flex direction={"row"} gap={2}>
                <Text>places en Q4</Text>
                <TooltipIcon
                  label={
                    <Flex direction="column" gap={4}>
                      <Text>
                        Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des
                        taux d'emploi et de poursuite d'études appliquées au niveau de diplôme.
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
