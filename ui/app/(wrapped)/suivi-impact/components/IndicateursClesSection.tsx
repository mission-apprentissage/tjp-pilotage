import { Icon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Skeleton,
  Text,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { CURRENT_IJ_MILLESIME } from "shared";
import { OBJECTIF_TAUX_TRANSFO_REFORME } from "shared/objectives/TAUX_TRANSFO";
import { NEXT_RENTREE } from "shared/time/NEXT_RENTREE";

import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { IndicateurType, PilotageReformeStats, TauxTransformation } from "@/app/(wrapped)/suivi-impact/types";
import { BadgeMillesimes } from "@/components/BadgeMillesimes";
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeColors } from "@/theme/themeColors";
import { formatNumber, formatPercentageFixedDigits } from "@/utils/formatUtils";

import { MultiProgressBar } from "./MultiProgressBar";
const Loader = () => {
  return (
    <Box mt={12}>
      <Flex mt={8} height={"168px"}>
        <SimpleGrid spacing={3} columns={[2]} width={"100%"}>
          <Card height={40}>
            <CardBody py="2" px="3">
              <Skeleton opacity={0.3} height={"100%"} />
            </CardBody>
          </Card>
          <Card height={40}>
            <CardBody py="2" px="3">
              <Skeleton opacity={0.3} height={"100%"} />
            </CardBody>
          </Card>
        </SimpleGrid>
      </Flex>
    </Box>
  );
};


const DrapeauFrancaisIcon = ({ ...props }) => (
  <Icon boxSize={4} {...props}>
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
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_2362_2536" transform="matrix(0.00446964 0 0 0.00666667 -0.00283401 0)" />
        </pattern>
        <image
          id="image0_2362_2536"
          width="225"
          height="150"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  </Icon>
);

const Delta = ({ delta, isNational = false }: { delta: number | null; isNational?: boolean }) => {
  let deltaIcon;

  if (delta != null) {
    if (formatNumber(delta) < 0)
      deltaIcon = (
        <Flex>
          <TriangleDownIcon mt={1} me={2} boxSize={4} color={"redmarianne.472"} />
          <Text>{`${formatNumber(delta)} pts`}</Text>
        </Flex>
      );
    else if (formatNumber(delta) === 0)
      deltaIcon = (
        <Flex>
          <Text>{`+${formatNumber(delta)} pts`}</Text>
        </Flex>
      );
    else
      deltaIcon = (
        <Flex>
          <TriangleUpIcon mt={1} me={2} boxSize={4} color={"success.850"} />
          <Text>{`+${formatNumber(delta)} pts`}</Text>
        </Flex>
      );
  } else {
    deltaIcon = null;
  }

  return (
    <Flex fontSize={12} color={"blueecume.400_active"}>
      {deltaIcon}
      <Flex ms="auto">
        {isNational && <DrapeauFrancaisIcon mt={1.5} mx={1} />}
        <Text>N-1</Text>
      </Flex>
    </Flex>
  );
};

const StatCard = ({
  label,
  data,
  type = "tauxInsertion",
  color = "inherit",
  tooltip,
}: {
  label: string;
  data?: PilotageReformeStats;
  type?: IndicateurType;
  color?: string;
  tooltip?: React.ReactNode;
}) => {
  const getDeltaAnneeNMoins1 = (type: IndicateurType): number | null => {
    switch (type) {
    case "tauxInsertion":
      if (data?.annees[0].scoped.tauxInsertion && data?.annees[1].scoped.tauxInsertion)
        return (data?.annees[0].scoped.tauxInsertion - data?.annees[1].scoped.tauxInsertion) * 100;
      return null;
    case "tauxPoursuite":
      if (data?.annees[0].scoped.tauxPoursuite && data?.annees[1].scoped.tauxPoursuite)
        return (data?.annees[0].scoped.tauxPoursuite - data?.annees[1].scoped.tauxPoursuite) * 100;
      return null;
    default:
      if (data?.annees[0].scoped.tauxInsertion && data?.annees[1].scoped.tauxInsertion) {
        return (data?.annees[0].scoped.tauxInsertion - data?.annees[1].scoped.tauxInsertion) * 100;
      }
      return null;
    }
  };

  const getDeltaAnneeNMoins1Nationale = (type: IndicateurType): number | null => {
    if(type === "tauxPoursuite") {
      if (data?.annees[0].scoped.tauxPoursuite && data?.annees[1].nationale.tauxPoursuite) {
        return (data?.annees[0].scoped.tauxPoursuite - data?.annees[1].nationale.tauxPoursuite) * 100;
      }

      return null;
    }

    if (data?.annees[0].scoped.tauxInsertion && data?.annees[1].nationale.tauxInsertion) {
      return (data?.annees[0].scoped.tauxInsertion - data?.annees[1].nationale.tauxInsertion) * 100;
    }

    return null;
  };

  const getValue = (type: IndicateurType) => {
    switch (type) {
    case "tauxInsertion":
      return formatPercentageFixedDigits(data?.annees[0].scoped.tauxInsertion, 1, '-');
    case "tauxPoursuite":
      return formatPercentageFixedDigits(data?.annees[0].scoped.tauxPoursuite, 1, '-');
    default:
      return formatPercentageFixedDigits(data?.annees[0].scoped.tauxInsertion, 1, '-');
    }
  };

  return (
    <Card>
      <CardBody color={color} py="2" px="3" alignItems={"center"} minHeight={40}>
        <HStack
          width="100%"
          mr="4"
          flex={1}
        >
          <Heading
            as="h2"
            fontSize={15}
            fontWeight="500"
            textTransform={"uppercase"}
            color={"bluefrance.113"}
          >
            {label}
          </Heading>
          {tooltip}
        </HStack>
        <BadgeMillesimes millesimes={CURRENT_IJ_MILLESIME} mt={2}/>
        <Box fontWeight="bold" fontSize="40" color={"bluefrance.113"}>
          {getValue(type)}
        </Box>
        <Box fontWeight="bold" fontSize="2xl">
          {getDeltaAnneeNMoins1(type) != null ? <Delta delta={getDeltaAnneeNMoins1(type)} /> : <></>}
        </Box>
        {getDeltaAnneeNMoins1(type) != null && getDeltaAnneeNMoins1Nationale(type) != null ? <Divider /> : <></>}
        <Box fontWeight="bold" fontSize="2xl">
          {getDeltaAnneeNMoins1Nationale(type) != null ? (
            <Delta delta={getDeltaAnneeNMoins1Nationale(type)} isNational={true} />
          ) : (
            <></>
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

const TauxTransfoCard = (
  { tauxTransformationCumule,
    tauxTransformationCumulePrevisionnel,
    onModalOpen,
    nextRentree
  } :
  { tauxTransformationCumule?: TauxTransformation,
    tauxTransformationCumulePrevisionnel?: TauxTransformation,
    onModalOpen: () => void,
    nextRentree: number
  }) => {
  const [blue, cyan, grey] = useToken("colors", ["bluefrance.113", "blueecume.675_hover", "grey.925"]);

  return (
    <VStack width="100%">
      <Card width="100%">
        <CardBody color="inherit" py="2" px="3" minHeight={40}>
          <VStack
            width="100%"
            px="8px"
            padding="8px"
            gap="16px"
            color={themeColors.bluefrance[113]}
            alignItems="start"
          >
            <Flex direction="row" justifyContent={"space-between"} w={"100%"} alignItems={"center"}>
              <Heading
                as="h2"
                fontSize={15}
                fontWeight="500"
                lineHeight="24px"
                textTransform="uppercase"
              >
              Taux de transformation cumulé
              </Heading>
              <TooltipIcon
                label={
                  <Box>
                    <Text>Comprendre le calcul du taux de transformation cumulé. Cliquez pour plus d’infos.</Text>
                  </Box>
                } onClick={onModalOpen}
              />
            </Flex>
            <Box width="100%">
              { tauxTransformationCumule && tauxTransformationCumulePrevisionnel && (
                <MultiProgressBar
                  bars={[
                    {value: OBJECTIF_TAUX_TRANSFO_REFORME, label: 'Objectif de la réforme', color: grey},
                    {value: tauxTransformationCumulePrevisionnel?.taux, label: `Projets RS ${nextRentree} inclus`, color: cyan, tooltip:`${tauxTransformationCumulePrevisionnel?.placesTransformees} / ${tauxTransformationCumulePrevisionnel?.effectifs}`},
                    {value: tauxTransformationCumule?.taux, label: 'Demandes validées', color: blue, tooltip:`${tauxTransformationCumule?.placesTransformees} / ${tauxTransformationCumule?.effectifs}`}
                  ].filter(bar => typeof bar?.value !== "undefined").sort((a, b) => b.value! - a.value!).map((taux, index) => ({...taux, order: index + 1} as {
                  value: number;
                  label: string;
                  color: string;
                  tooltip?: string;
                  order: number;
              }))}
                  max={Math.max(OBJECTIF_TAUX_TRANSFO_REFORME,
                    tauxTransformationCumulePrevisionnel?.taux ?? 0,
                    tauxTransformationCumule?.taux ?? 0)}
                />
              )}
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

const IndicateursSortie = ({ data, onModalOpen }: { data?: PilotageReformeStats, onModalOpen: () => void }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <Flex direction={"column"} w="100%">
      <Heading as="h1" fontSize={20} fontWeight={700} lineHeight={"31px"}>
        INDICATEURS CLÉS DE LA RÉFORME
      </Heading>
      <VStack width="100%" spacing="18px" mt="12px">
        <TauxTransfoCard
          tauxTransformationCumule={data?.scoped.tauxTransformationCumule}
          tauxTransformationCumulePrevisionnel={data?.scoped.tauxTransformationCumulePrevisionnel}
          onModalOpen={onModalOpen}
          nextRentree={Math.max(...(data?.rentreesScolaire ?? []).map(Number)) ?? Number(NEXT_RENTREE)}
        />
        <SimpleGrid spacing={3} columns={[2]} width="100%">
          <StatCard
            label="taux d'emploi à 6 mois"
            data={data}
            tooltip={<TooltipDefinitionTauxEmploi6Mois />}
          />
          <StatCard
            label="taux poursuite d'études"
            data={data}
            type="tauxPoursuite"
            tooltip={
              <TooltipIcon
                mr="6px"
                label={
                  <Box>
                    <Text>Tout élève inscrit à la rentrée N+1 (réorientation et redoublement compris)</Text>
                    <Text>Cliquez pour plus d'infos.</Text>
                  </Box>
                }
                onClick={() => openGlossaire("taux-poursuite-etudes")}
              />
            }
          />
        </SimpleGrid>
      </VStack>
    </Flex>
  );
};

export const IndicateursClesSection = (
  { data, isLoading, onModalOpen }:
  { data?: PilotageReformeStats; isLoading: boolean; onModalOpen: () => void }) =>
{
  if(isLoading){
    return (<Loader />);
  }

  return (<IndicateursSortie data={data} onModalOpen={onModalOpen} />);
};
