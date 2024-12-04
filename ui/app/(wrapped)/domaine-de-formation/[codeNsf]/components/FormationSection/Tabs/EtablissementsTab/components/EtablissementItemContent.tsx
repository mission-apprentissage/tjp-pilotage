import { Badge, Box, Divider, HStack, Link, Text, Tooltip, VStack } from "@chakra-ui/react";
import { InlineIcon } from "@iconify/react";
import { CURRENT_RENTREE } from "shared";

import type { Etablissement } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { TableBadge } from "@/components/TableBadge";
import { themeDefinition } from "@/theme/theme";
import { formatNumber, formatPercentage } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

const formatDispositifs = (dispositifs: string[]) => {
  return dispositifs
    .filter((libelle) => libelle !== "")
    .map((d) => {
      return d.replace(/\sen\s/i, " ").replace(/professionnel/i, "PRO");
    });
};
const formatSecteur = (secteur: string) => {
  switch (secteur) {
    case "PU":
      return "Public";
    case "PR":
      return "Privé";
    default:
      return "";
  }
};

const formatDepartement = (departement: string) => {
  if (departement.length === 3 && departement.startsWith("0")) {
    return departement.substring(1);
  }

  return departement;
};

export const EtablissementItemContent = ({ etablissement }: { etablissement: Etablissement }) => {
  const isScolaire = etablissement.isScolaire;
  const isApprentissage = etablissement.isApprentissage;

  const tooltipLabelEffectif = (() => {
    if (etablissement.effectifs !== undefined) {
      if (isScolaire && !isApprentissage) {
        return `Effectif - en entrée (rentrée ${CURRENT_RENTREE})`;
      }

      if (isScolaire && isApprentissage) {
        return `Effectif voie scolaire - en entrée (rentrée ${CURRENT_RENTREE}) `;
      }
    }

    if (isApprentissage && !isScolaire) {
      return `Données indisponibles pour l'apprentissage`;
    }

    return `Données indisponibles`;
  })();

  const tooltilLabelTauxDevenir = (() => {
    if (etablissement.tauxDevenir !== undefined) {
      return `Taux de devenir favorable à 6 mois (rentrée ${CURRENT_RENTREE})`;
    }

    if (isApprentissage && !isScolaire) {
      return `Données indisponibles pour l'apprentissage`;
    }

    return `Données indisponibles`;
  })();

  const tooltipLabelTauxPression = (() => {
    if (etablissement.tauxPression !== undefined) {
      if (etablissement.isBTS) {
        return `Taux de demande (rentrée ${CURRENT_RENTREE})`;
      }

      return `Taux de pression (rentrée ${CURRENT_RENTREE})`;
    }

    if (isApprentissage && !isScolaire) {
      return `Données indisponibles pour l'apprentissage`;
    }

    return "Données indisponibles";
  })();

  return (
    <VStack>
      <HStack justifyContent={"space-between"} width="100%">
        <HStack>
          <Link href={`/panorama/etablissement/${etablissement.uai}`} isExternal fontWeight={700}>
            {etablissement.libelle}
          </Link>
        </HStack>
        <HStack flexWrap="wrap" justifyContent="flex-end">
          {formatDispositifs(etablissement.libellesDispositifs).map((libelle) => (
            <Badge key={`${etablissement.uai}-${libelle}`} variant="neutral">
              {libelle}
            </Badge>
          ))}
        </HStack>
      </HStack>
      <HStack justifyContent={"space-between"} width="100%">
        <HStack
          fontSize="12px"
          color={themeDefinition.colors.grey[425]}
          divider={<Divider orientation="vertical" h="12px" w="1px" />}
        >
          <Text>
            {etablissement.commune} ({formatDepartement(etablissement.codeDepartement)})
          </Text>
          {etablissement.secteur && <Text>{formatSecteur(etablissement.secteur)}</Text>}
        </HStack>
      </HStack>
      <HStack width="100%" justifyContent="space-between" flexWrap="wrap">
        <HStack gap="8px" minWidth="250px">
          {etablissement.isScolaire && (
            <Badge variant="info" key={`${etablissement.uai}-scolaire`}>
              <Box display="inline" mr="4px">
                <InlineIcon icon="ri:briefcase-5-line" color={themeDefinition.colors.info.text} />
              </Box>
              Scolaire
            </Badge>
          )}
          {etablissement.isApprentissage && (
            <Badge variant="new" key={`${etablissement.uai}-apprentissage`}>
              <Box display="inline" mr="4px">
                <InlineIcon icon="ri:hotel-line" color={themeDefinition.colors.yellowTournesol[407]} />
              </Box>
              Apprentissage
            </Badge>
          )}
        </HStack>
        <HStack
          gap="8px"
          fontSize="12px"
          divider={<Divider h="12px" w="1px" orientation="vertical" />}
          color={themeDefinition.colors.grey[425]}
        >
          <Tooltip label={tooltipLabelEffectif}>
            <HStack gap="4px" width="40px" justifyContent="flex-start" alignItems="center">
              <InlineIcon icon="ri:group-line" height="14px" width="14px" />
              <Text>{etablissement.effectifs !== undefined ? etablissement.effectifs : "--"}</Text>
            </HStack>
          </Tooltip>
          <Tooltip label={tooltilLabelTauxDevenir}>
            <HStack gap="4px" width="55px" justifyContent="flex-start" alignItems="center">
              <InlineIcon icon="ri:thumb-up-line" height="14px" width="14px" />
              <Text>
                {etablissement.tauxDevenir !== undefined ? formatPercentage(etablissement.tauxDevenir) : "--"}
              </Text>
            </HStack>
          </Tooltip>
          <Tooltip label={tooltipLabelTauxPression}>
            <HStack gap="4px" width="65px" justifyContent="flex-start" alignItems="center">
              <InlineIcon icon="ri:temp-cold-line" height="14px" width="14px" />
              <TableBadge sx={getTauxPressionStyle(etablissement.tauxPression)}>
                {etablissement.tauxPression !== undefined ? formatNumber(etablissement.tauxPression, 2) : "-"}
              </TableBadge>
            </HStack>
          </Tooltip>
        </HStack>
      </HStack>
    </VStack>
  );
};
