import { Box, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { ScopeEnum } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { OBJECTIF_TAUX_TRANSFO_PERCENTAGE } from "shared/objectives/TAUX_TRANSFO";

import { client } from "../../../../../api.client";
import { themeDefinition } from "../../../../../theme/theme";
import { roundNumber } from "../../../../../utils/roundNumber";
import { ProgressBar } from "../../../components/ProgressBar";
import { useScopeCode } from "../hooks";
import {
  FiltersStatsPilotageIntentions,
  Indicateur,
  StatsPilotageIntentions,
  Statut,
} from "../types";
import { CartoSection } from "./Carto";

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
      >
        {title}
      </Text>
      <Box flex="1">{children}</Box>
    </VStack>
  );
};

// À passer côté API si possible
function generatePercentageDataOr(
  code: string | undefined,
  data?: StatsPilotageIntentions,
  or: string = "-"
) {
  return (statut: Statut, indicateur: Indicateur) => {
    if (
      typeof code === "undefined" ||
      typeof data?.[statut]?.[`_${code}`]?.[indicateur] === "undefined" ||
      (indicateur === "tauxTransformation" &&
        data?.[statut]?.[`_${code}`].effectif === 0)
    ) {
      return or;
    }

    return (
      Number.parseFloat(
        (data?.[statut]?.[`_${code}`]?.[indicateur] ?? 0).toFixed(1)
      ) / 100
    );
  };
}

function generateGetScopedData(
  code: string | undefined,
  data?: StatsPilotageIntentions
) {
  return (statut: Statut, indicateur: Indicateur): number => {
    if (!code) return 0;
    return Number.parseFloat(
      (data?.[statut]?.[`_${code}`]?.[indicateur] ?? 0).toFixed(1)
    );
  };
}

const NumberWithLabel = ({
  icon,
  label,
  percentage,
  objective,
}: {
  icon?: React.ReactNode;
  label?: string;
  percentage: number | string;
  objective?: number;
}) => {
  return (
    <VStack
      alignItems="start"
      height="100%"
      justifyContent="start"
      minWidth="200px"
    >
      <HStack>
        {icon}
        <Text fontSize="12px" fontWeight="700" lineHeight="20px">
          {label}
        </Text>
      </HStack>
      <VStack gap="16px" width="100%" alignItems="start">
        <Text fontSize="32px" lineHeight="40px" fontWeight="700">
          {typeof percentage === "string"
            ? percentage
            : roundNumber(percentage * 100)}
          %
        </Text>
        {objective && typeof percentage !== "string" && (
          <Box width="100%">
            <ProgressBar percentage={(percentage / objective) * 100} />
            <Text color={themeDefinition.colors.grey[425]}>
              {roundNumber((percentage * 100) / objective, 0)}% de l'objectif
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
};

export const IndicateursClesSection = ({
  data,
  filters,
}: {
  data: StatsPilotageIntentions | undefined;
  filters: FiltersStatsPilotageIntentions;
}) => {
  console.log(data);
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

  const { code } = useScopeCode(filters);

  const getScopedData = useMemo(
    () => generateGetScopedData(code, data),
    [generateGetScopedData, data, code]
  );

  const getPercentageDataOr = useMemo(() => {
    console.log("getPercentageDataOr", code, data, "-");
    return generatePercentageDataOr(code, data, "-");
  }, [generatePercentageDataOr, data, code]);

  const getNationalData = useMemo(
    () => generateGetScopedData(ScopeEnum.national, nationalStats),
    [generateGetScopedData, nationalStats]
  );

  console.log(
    getPercentageDataOr(
      DemandeStatutEnum["demande validée"],
      "tauxTransformation"
    )
  );

  return (
    <VStack
      gap="16px"
      width="100%"
      alignItems="start"
      color={themeDefinition.colors.grey[50]}
    >
      <Text fontWeight="700" fontSize="20px" lineHeight="28px">
        Indicateurs clés de la transformation
      </Text>
      <Grid
        templateColumns="minmax(0, 5fr) minmax(0, 4fr)"
        width="100%"
        gap="16px"
      >
        <GridItem>
          <Grid
            backgroundColor="red"
            templateColumns="repeat(3, minmax(0, 1fr))"
            templateRows="repeat(3, minmax(0, 1fr))"
            height="100%"
            gap="16px"
          >
            <GridItem colSpan={2} backgroundColor="blue">
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
                      percentage={getPercentageDataOr(
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
                      percentage={getPercentageDataOr(
                        DemandeStatutEnum["demande validée"],
                        "tauxTransformation"
                      )}
                      objective={OBJECTIF_TAUX_TRANSFO_PERCENTAGE}
                    />
                  </GridItem>
                </Grid>
              </Card>
            </GridItem>
            <GridItem backgroundColor="violet" height="100%">
              <Card title="Ratio de fermetures">
                <GridItem height="100%">
                  {
                    //TODO
                  }
                  <NumberWithLabel label=" " percentage={0.2} />
                </GridItem>
              </Card>
            </GridItem>
            {
              //TODO
            }
            <GridItem backgroundColor="green" />
            <GridItem backgroundColor="green" />
            <GridItem backgroundColor="green" />
            <GridItem colSpan={3} backgroundColor="black" />
          </Grid>
        </GridItem>
        <GridItem>
          <Grid backgroundColor="yellow" height="100%">
            <CartoSection
              indicateur="tauxTransformation"
              handleIndicateurChange={() => {}}
              indicateurOptions={[
                {
                  label: "taux de transformation",
                  value: "tauxTransformation",
                  isDefault: true,
                },
              ]}
              filters={filters}
              data={data}
              handleFilters={() => {}}
            />
          </Grid>
        </GridItem>
      </Grid>
    </VStack>
  );
};
