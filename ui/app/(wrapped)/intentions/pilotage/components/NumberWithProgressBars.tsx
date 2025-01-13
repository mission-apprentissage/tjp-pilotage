import { Flex, Heading, HStack } from "@chakra-ui/react";

import { ProgressBar } from "@/components/ProgressBar";
import { themeDefinition } from "@/theme/theme";
import { themeColors } from "@/theme/themeColors";
import { formatPercentageWithoutSign } from "@/utils/formatUtils";

export const NumberWithProgressBars = ({
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
        <Heading
          as="h3"
          pb="8px"
          fontSize={14}
          fontStyle="normal"
          fontWeight="500"
          lineHeight="24px"
          textTransform="uppercase"
          color={themeColors.bluefrance[113]}
        >
          {title}
        </Heading>
        {tooltip}
      </HStack>
      <Heading as="h4" fontSize="32px" fontWeight="800" color="grey.50">
        {all}
      </Heading>
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
