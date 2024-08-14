import { Box, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { themeDefinition } from "../../../../../theme/theme";
import { roundNumber } from "../../../../../utils/roundNumber";
import { ProgressBar } from "../../../components/ProgressBar";
import { StatsPilotageIntentions } from "../types";

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

const PercentageWithLabel = ({
  icon,
  label,
  percentage,
  objective,
}: {
  icon?: React.ReactNode;
  label?: string;
  percentage: number;
  objective?: number;
}) => {
  return (
    <VStack
      alignItems="start"
      height="100%"
      justifyContent="center"
      minWidth="200px"
    >
      <HStack>
        {icon}
        <Text fontSize="12px" fontWeight="700" lineHeight="20px">
          {label}
        </Text>
      </HStack>
      <VStack gap="16px" width="100%">
        <Text fontSize="32px" lineHeight="40px" fontWeight="700">
          {roundNumber(percentage * 100)}%
        </Text>
        {objective && (
          <Box>
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
}: {
  data: StatsPilotageIntentions | undefined;
}) => {
  console.log(data);
  return (
    <VStack
      gap="16px"
      width="100%"
      alignItems="start"
      color={themeDefinition.colors.grey[50]}
      height="500px"
    >
      <Text fontWeight="700" fontSize="20px" lineHeight="28px">
        Indicateurs clés de la transformation
      </Text>
      <Grid
        templateColumns="minmax(0, 5fr) minmax(0, 4fr)"
        width="100%"
        height="100%"
      >
        <GridItem>
          <Grid
            backgroundColor="red"
            templateColumns="repeat(3, minmax(0, 1fr))"
            templateRows="repeat(3, 1fr)"
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
                    <PercentageWithLabel
                      label="Projets"
                      icon={<Icon icon="ri:file-text-line" />}
                      percentage={0.5}
                      objective={0.7}
                    />
                  </GridItem>
                  <GridItem height="100%">
                    <PercentageWithLabel
                      label="Demandes validées"
                      icon={<Icon icon="ri:checkbox-circle-line" />}
                      percentage={0.9}
                      objective={0.7}
                    />
                  </GridItem>
                </Grid>
              </Card>
            </GridItem>
            <GridItem backgroundColor="violet" height="100%">
              <Card title="Ratio de fermetures">
                <GridItem height="100%">
                  <PercentageWithLabel percentage={0.9} />
                </GridItem>
              </Card>
            </GridItem>
            <GridItem backgroundColor="green" />
            <GridItem backgroundColor="green" />
            <GridItem backgroundColor="green" />
            <GridItem colSpan={3} backgroundColor="black" />
          </Grid>
        </GridItem>
        <GridItem>
          <Grid backgroundColor="yellow" height="100%"></Grid>
        </GridItem>
      </Grid>
    </VStack>
  );
};
