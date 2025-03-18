import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {Box,Button,Collapse,Divider, Flex, Grid, GridItem, HStack, Skeleton, Text, VisuallyHidden, VStack} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import _ from 'lodash';
import { useState } from 'react';
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { OBJECTIF_TAUX_TRANSFO_PERCENTAGE } from "shared/objectives/TAUX_TRANSFO";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import {getStatutBgColor} from '@/app/(wrapped)/intentions/components/StatutTag';
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
import {ProgressBar} from '@/components/ProgressBar';
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeDefinition } from "@/theme/theme";
import { formatPercentage, formatPercentageWithoutSign} from '@/utils/formatUtils';

const Loader = () => {
  return (
    <Flex
      minH={535}
      minW={705}
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
  statut: DemandeStatutType | "Total" | Array<DemandeStatutType | "Total">,
  indicateur: IndicateurRepartition
}): number => {
  if(Array.isArray(statut)) {
    return statut.reduce(
      (acc, current) => acc + (getScopedData({ statuts, statut: current, indicateur }) ?? 0),
      0) as number;
  }
  return statuts?.[statut]?.[indicateur] as number;
};

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
  const [showMore, setShowMore] = useState(false);

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
                label="Projets"
                icon={<Icon icon="ri:file-text-line" />}
                scopeCode={getScopeCode(filters)}
                statuts={getDataIndicateur({ data, indicateur: "tauxTransformation" })}
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
              />
            </GridItem>
            <GridItem colSpan={1}>
              <NumberWithLabel
                label="Demandes validées"
                icon={<Icon icon="ri:checkbox-circle-line" />}
                scopeCode={getScopeCode(filters)}
                statuts={getDataIndicateur({ data, indicateur: "tauxTransformation" })}
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
            <GridItem colSpan={2}>
              <Flex ms={"auto"}>
                <Button
                  variant="link"
                  size="sm"
                  ms={"auto"}
                  color={"bluefrance.113"}
                  onClick={() => setShowMore((showMore) => !showMore)}
                  rightIcon={showMore ? <ChevronUpIcon mt={"auto"}/> : <ChevronDownIcon mt={"auto"}/>}
                  iconSpacing={1}
                >
                  {showMore ? "Voir moins" : "Voir plus"}
                </Button>
              </Flex>
              <Collapse in={showMore} >
                <DetailsTauxDeTransformation statuts={getDataIndicateur({ data, indicateur: "tauxTransformation" })} round={1} objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE} />
              </Collapse>
            </GridItem>
          </Grid>
        </IndicateurCard>
        <IndicateurCard title="Ratio de fermetures">
          <Flex direction="column">
            <NumberWithLabel
              label={<VisuallyHidden>Ratio de fermetures</VisuallyHidden>}
              scopeCode={getScopeCode(filters)}
              statuts={getDataIndicateur({ data, indicateur: "ratioFermeture" })}
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
            <Flex ms={"auto"} mt={"auto"}>
              <Button
                variant="link"
                size="sm"
                ms={"auto"}
                color={"bluefrance.113"}
                onClick={() => setShowMore((showMore) => !showMore)}
                rightIcon={showMore ? <ChevronUpIcon mt={"auto"}/> : <ChevronDownIcon mt={"auto"}/>}
                iconSpacing={1}
              >
                {showMore ? "Voir moins" : "Voir plus"}
              </Button>
            </Flex>
            <Collapse in={showMore} >
              <DetailsRatioFermeture statuts={getDataIndicateur({ data, indicateur: "ratioFermeture" })} round={1} />
            </Collapse>
          </Flex>
        </IndicateurCard>
      </Flex>
      <Flex direction={"row"} gap={6}>
        <NumberWithProgressBars
          icon={<Icon width="24px" icon="ri:user-add-fill" color={themeDefinition.colors.bluefrance[525]} />}
          title="Pl. Ouvertes"
          statuts={getDataIndicateur({ data, indicateur: "placesOuvertes" })}
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
          statuts={getDataIndicateur({ data, indicateur: "placesFermees" })}
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
          statuts={getDataIndicateur({ data, indicateur: "placesColorees" })}
          tooltip={
            <TooltipIcon
              label={
                <Box>
                  <Text>
                    Dans Orion, à partir de la campagne 2024, on désigne comme «Colorations» les places ouvertes
                    colorées soit la différence (si elle est positive) entre le nombre de places colorées actuelles
                    et le nombre de futurs places colorées d'une demande de transformation sur Orion.
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



const DetailsTauxDeTransformation = ({
  statuts,
  round,
  objective
} : {
  statuts: Record<string, number>;
  round: number;
  objective: number;
}) =>
  (
    <Flex direction={"column"} gap={2} p={3}>
      <Text fontSize={14} fontWeight="700" lineHeight="20px">
        Détail par statut
      </Text>
      <ProgressBar
        percentage={formatPercentageWithoutSign((statuts[DemandeStatutEnum["dossier complet"]] / objective), round)}
        rightLabel={_.capitalize(DemandeStatutEnum["dossier complet"])}
        leftLabel={formatPercentage(statuts[DemandeStatutEnum["dossier complet"]], round)}
        colorScheme={getStatutBgColor(DemandeStatutEnum["dossier complet"])}
      />
      <ProgressBar
        percentage={formatPercentageWithoutSign((statuts[DemandeStatutEnum["dossier incomplet"]] / objective), round)}
        rightLabel={_.capitalize(DemandeStatutEnum["dossier incomplet"])}
        leftLabel={formatPercentage(statuts[DemandeStatutEnum["dossier incomplet"]], round)}
        colorScheme={getStatutBgColor(DemandeStatutEnum["dossier incomplet"])}
      />
      <ProgressBar
        percentage={formatPercentageWithoutSign((statuts[DemandeStatutEnum["proposition"]] / objective), round)}
        rightLabel={_.capitalize(DemandeStatutEnum["proposition"])}
        leftLabel={formatPercentage(statuts[DemandeStatutEnum["proposition"]], round)}
        colorScheme={getStatutBgColor(DemandeStatutEnum["proposition"])}
      />
      <ProgressBar
        percentage={formatPercentageWithoutSign((statuts[DemandeStatutEnum["projet de demande"]] / objective), round)}
        rightLabel={_.capitalize(DemandeStatutEnum["projet de demande"])}
        leftLabel={formatPercentage(statuts[DemandeStatutEnum["projet de demande"]], round)}
        colorScheme={getStatutBgColor(DemandeStatutEnum["projet de demande"])}
      />
      <ProgressBar
        percentage={formatPercentageWithoutSign((statuts[DemandeStatutEnum["prêt pour le vote"]] / objective), round)}
        rightLabel={_.capitalize(DemandeStatutEnum["prêt pour le vote"])}
        leftLabel={formatPercentage(statuts[DemandeStatutEnum["prêt pour le vote"]], round)}
        colorScheme={getStatutBgColor(DemandeStatutEnum["prêt pour le vote"])}
      />
      <ProgressBar
        percentage={formatPercentageWithoutSign((statuts[DemandeStatutEnum["demande validée"]] / objective), round)}
        rightLabel={_.capitalize(DemandeStatutEnum["demande validée"])}
        leftLabel={formatPercentage(statuts[DemandeStatutEnum["demande validée"]], round)}
        colorScheme={getStatutBgColor(DemandeStatutEnum["demande validée"])}
      />
    </Flex>
  );


const DetailsRatioFermeture = ({
  statuts,
  round
} : {
  statuts: Record<string, number>;
  round: number;
}) =>
  <Flex direction={"column"} gap={2} p={3}>
    <Text fontSize={14} fontWeight="700" lineHeight="20px">
      Détail par statut
    </Text>
    <Flex direction={"column"} gap={2}>
      <Flex direction={"row"} gap={2} fontSize={12} height={"16px"}>
        <Text>{_.capitalize(DemandeStatutEnum["dossier complet"])} :</Text>
        <Text>{formatPercentage((statuts[DemandeStatutEnum["dossier complet"]]), round)}</Text>
      </Flex>
      <Flex direction={"row"} gap={2} fontSize={12} height={"16px"}>
        <Text>{_.capitalize(DemandeStatutEnum["dossier complet"])} :</Text>
        <Text>{formatPercentage((statuts[DemandeStatutEnum["dossier incomplet"]]), round)}</Text>
      </Flex>
      <Flex direction={"row"} gap={2} fontSize={12} height={"16px"}>
        <Text>{_.capitalize(DemandeStatutEnum["proposition"])} :</Text>
        <Text>{formatPercentage((statuts[DemandeStatutEnum["proposition"]]), round)}</Text>
      </Flex>
      <Flex direction={"row"} gap={2} fontSize={12} height={"16px"}>
        <Text>{_.capitalize(DemandeStatutEnum["projet de demande"])} :</Text>
        <Text>{formatPercentage((statuts[DemandeStatutEnum["projet de demande"]]), round)}</Text>
      </Flex>
      <Flex direction={"row"} gap={2} fontSize={12} height={"16px"}>
        <Text>{_.capitalize(DemandeStatutEnum["prêt pour le vote"])} :</Text>
        <Text>{formatPercentage((statuts[DemandeStatutEnum["prêt pour le vote"]]), round)}</Text>
      </Flex>
      <Flex direction={"row"} gap={2} fontSize={12} height={"16px"}>
        <Text>{_.capitalize(DemandeStatutEnum["demande validée"])} :</Text>
        <Text>{formatPercentage((statuts[DemandeStatutEnum["demande validée"]]), round)}</Text>
      </Flex>
    </Flex>
  </Flex>;
