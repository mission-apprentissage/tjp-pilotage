import { Box, Divider, Flex, Grid, GridItem, HStack, Skeleton, Text, VisuallyHidden, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { OBJECTIF_TAUX_TRANSFO_PERCENTAGE } from "shared/objectives/TAUX_TRANSFO";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { IndicateurCard } from "@/app/(wrapped)/intentions/pilotage/components/IndicateurCard";
import { NumberWithLabel } from "@/app/(wrapped)/intentions/pilotage/components/NumberWithLabel";
import { NumberWithProgressBars } from "@/app/(wrapped)/intentions/pilotage/components/NumberWithProgressBars";
import type {
  FiltersPilotageIntentions,
  IndicateurRepartition,
  PilotageIntentions,
  PilotageIntentionsStatuts,
} from '@/app/(wrapped)/intentions/pilotage/types';
import {getScopeCode} from '@/app/(wrapped)/intentions/pilotage/utils';
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

const getScopedData = ({
  statuts,
  statut,
  indicateur
} : {
  statuts?: PilotageIntentionsStatuts,
  statut: DemandeStatutType | "Total",
  indicateur: IndicateurRepartition
}): number => statuts?.[statut]?.[indicateur] as number;

const getDataIndicateur = ({
  data,
  indicateur
} : {
  data?: PilotageIntentions,
  indicateur: IndicateurRepartition
}): Record<string, number> =>
  data ? Object.keys(data.statuts)
    .map((key) => {
      const statut = data.statuts[key];
      return { [key]: statut[indicateur] as number };
    }).reduce((acc, current) => ({ ...acc, ...current }), {})
    : {};


export const IndicateursClesSection = ({
  data,
  filters,
  isLoading,
  onOpenTauxTransfoDefinition,
}: {
  data?: PilotageIntentions;
  filters: FiltersPilotageIntentions;
  isLoading?: boolean;
  onOpenTauxTransfoDefinition: () => void;
}) => {
  const { openGlossaire } = useGlossaireContext();

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
            <GridItem colSpan={1}>
              <NumberWithLabel
                label="Projets de demande"
                icon={<Icon icon="ri:file-text-line" />}
                scopeCode={getScopeCode(filters)}
                statuts={getDataIndicateur({ data: data, indicateur: "tauxTransformation" })}
                percentage={getScopedData({
                  statuts: data?.statuts,
                  statut: DemandeStatutEnum["projet de demande"],
                  indicateur: "tauxTransformation"
                })}
                nationalPercentage={getScopedData({
                  statuts: data?.statutsNational,
                  statut: DemandeStatutEnum["projet de demande"],
                  indicateur: "tauxTransformation"
                })}
                objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
                tooltip={
                  <TooltipIcon
                    mb={"auto"}
                    ms={1}
                    label="Somme des demandes en statut proposition / projet de demande / dossier complet et incomplet / prêt pour le vote."
                  />
                }
              />
            </GridItem>
            <GridItem colSpan={1}>
              <NumberWithLabel
                label="Demandes validées"
                icon={<Icon icon="ri:checkbox-circle-line" />}
                scopeCode={getScopeCode(filters)}
                statuts={getDataIndicateur({ data: data, indicateur: "tauxTransformation" })}
                percentage={getScopedData({
                  statuts: data?.statuts,
                  statut: DemandeStatutEnum["demande validée"],
                  indicateur: "tauxTransformation"
                })}
                nationalPercentage={getScopedData({
                  statuts: data?.statutsNational,
                  statut: DemandeStatutEnum["projet de demande"],
                  indicateur: "tauxTransformation"
                })}
                objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
              />
            </GridItem>
          </Grid>
        </IndicateurCard>
        <IndicateurCard title="Ratio de fermetures">
          <NumberWithLabel
            label={<VisuallyHidden>Ratio de fermetures</VisuallyHidden>}
            scopeCode={getScopeCode(filters)}
            statuts={getDataIndicateur({ data: data, indicateur: "ratioFermeture" })}
            percentage={getScopedData({
              statuts: data?.statuts,
              statut: "Total",
              indicateur: "ratioFermeture"
            })}
            nationalPercentage={getScopedData({
              statuts: data?.statutsNational,
              statut: "Total",
              indicateur: "ratioFermeture"
            })}
          />
        </IndicateurCard>
      </Flex>
      <Flex direction={"row"} gap={6}>
        <NumberWithProgressBars
          icon={<Icon width="24px" icon="ri:user-add-fill" color={themeDefinition.colors.bluefrance[525]} />}
          title="Pl. Ouvertes"
          statuts={getDataIndicateur({ data: data, indicateur: "placesOuvertes" })}
        >
          <Divider />
          <VStack width="100%" color={themeDefinition.colors.grey[425]} fontSize={12}>
            <Text alignSelf="end">dont</Text>
            <HStack justifyContent="space-between" width="100%" alignItems="start">
              <Text>
                {formatPercentage(
                  getScopedData({
                    statuts: data?.statuts,
                    statut: "Total",
                    indicateur: "placesOuvertesQ1"
                  }) / getScopedData({
                    statuts: data?.statuts,
                    statut: "Total",
                    indicateur: "placesOuvertes"
                  }),
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
          icon={<Icon width="24px" icon="ri:user-unfollow-fill" color={themeDefinition.colors.success["425_active"]} />}
          title="Pl. Fermées"
          statuts={getDataIndicateur({ data: data, indicateur: "placesFermees" })}
        >
          <Divider />
          <VStack width="100%" color={themeDefinition.colors.grey[425]} fontSize={12}>
            <Text alignSelf="end">dont</Text>
            <HStack justifyContent="space-between" width="100%" alignItems="start">
              <Text>
                {formatPercentage(
                  getScopedData({
                    statuts: data?.statuts,
                    statut: "Total",
                    indicateur: "placesFermeesQ4"
                  }) / getScopedData({
                    statuts: data?.statuts,
                    statut: "Total",
                    indicateur: "placesFermees"
                  }),
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
          icon={
            <Icon
              width="24px"
              icon="ri:account-pin-box-fill"
              color={themeDefinition.colors.purpleGlycine["850_active"]}
            />
          }
          title="Colorations"
          statuts={getDataIndicateur({ data: data, indicateur: "placesColorees" })}
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
          <VStack width="100%" color={themeDefinition.colors.grey[425]} fontSize={12}>
            <Text alignSelf="end">dont</Text>
            <HStack justifyContent="space-between" width="100%" alignItems="start">
              <Text>
                {formatPercentage(
                  getScopedData({
                    statuts: data?.statuts,
                    statut: "Total",
                    indicateur: "placesColoreesQ4"
                  }) / getScopedData({
                    statuts: data?.statuts,
                    statut: "Total",
                    indicateur: "placesColorees"
                  }),
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
