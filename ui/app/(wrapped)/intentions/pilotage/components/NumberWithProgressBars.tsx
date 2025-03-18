import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {Button,Collapse,Flex, Heading, HStack} from '@chakra-ui/react';
import { useState } from 'react';
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getStatutBgColor } from "@/app/(wrapped)/intentions/components/StatutTag";
import { ProgressBar } from "@/components/ProgressBar";
import { themeDefinition } from "@/theme/theme";
import { themeColors } from "@/theme/themeColors";
import { formatNumber, formatPercentageWithoutSign } from "@/utils/formatUtils";

export const NumberWithProgressBars = ({
  statuts,
  title,
  icon,
  tooltip,
  children,
}: {
  statuts: Record<DemandeStatutType | "Total", number>;
  title: string;
  icon?: React.ReactNode;
  tooltip?: React.ReactNode;
  children?: React.ReactNode;
}) => {

  const [showMore, setShowMore] = useState(false);

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
      <Heading as="h4" fontSize="32px" fontWeight="800" color="grey.50" mb={6}>
        {statuts["Total"]}
      </Heading>
      <ProgressBar
        percentage={formatPercentageWithoutSign(formatNumber(statuts[DemandeStatutEnum["demande validée"]]) / statuts["Total"])}
        rightLabel="Validées"
        leftLabel={formatNumber(statuts[DemandeStatutEnum["demande validée"]])}
        colorScheme={getStatutBgColor(DemandeStatutEnum["demande validée"])}
      />
      <ProgressBar
        percentage={formatPercentageWithoutSign(formatNumber(statuts[DemandeStatutEnum["projet de demande"]]) / statuts["Total"])}
        rightLabel="Projet de demande"
        leftLabel={formatNumber(statuts[DemandeStatutEnum["projet de demande"]])}
        colorScheme={getStatutBgColor(DemandeStatutEnum["projet de demande"])}
      />
      <Button
        variant="link"
        size="sm"
        ms={"auto"}
        color={themeColors.bluefrance[113]}
        onClick={() => setShowMore((showMore) => !showMore)}
        rightIcon={showMore ? <ChevronUpIcon mt={"auto"}/> : <ChevronDownIcon mt={"auto"}/>}
        iconSpacing={1}
      >
        {showMore ? "Voir moins" : "Voir plus"}
      </Button>
      <Collapse in={showMore} >
        <Flex direction={"column"} gap="8px">
          <ProgressBar
            percentage={formatPercentageWithoutSign(formatNumber(statuts[DemandeStatutEnum["dossier complet"]]) / statuts["Total"])}
            rightLabel="Dossier complet"
            leftLabel={formatNumber(statuts[DemandeStatutEnum["dossier complet"]])}
            colorScheme={getStatutBgColor(DemandeStatutEnum["dossier complet"])}
          />
          <ProgressBar
            percentage={formatPercentageWithoutSign(formatNumber(statuts[DemandeStatutEnum["dossier incomplet"]]) / statuts["Total"])}
            rightLabel="Dossier incomplet"
            leftLabel={formatNumber(statuts[DemandeStatutEnum["dossier incomplet"]])}
            colorScheme={getStatutBgColor(DemandeStatutEnum["dossier incomplet"])}
          />
          <ProgressBar
            percentage={formatPercentageWithoutSign(formatNumber(statuts[DemandeStatutEnum["proposition"]]) / statuts["Total"])}
            rightLabel="Proposition"
            leftLabel={formatNumber(statuts[DemandeStatutEnum["proposition"]])}
            colorScheme={getStatutBgColor(DemandeStatutEnum["proposition"])}
          />
          <ProgressBar
            percentage={formatPercentageWithoutSign(formatNumber(statuts[DemandeStatutEnum["prêt pour le vote"]]) / statuts["Total"])}
            rightLabel="Prêt pour le vote"
            leftLabel={formatNumber(statuts[DemandeStatutEnum["prêt pour le vote"]])}
            colorScheme={getStatutBgColor(DemandeStatutEnum["prêt pour le vote"])}
          />
        </Flex>
      </Collapse>
      {children}
    </Flex>
  );
};
