import { Badge, Box, Divider, HStack, Link, Text, Tooltip, VStack } from "@chakra-ui/react";
import { InlineIcon } from "@iconify/react";
import { useState } from "react";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import type { Etablissement } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { TableBadge } from "@/components/TableBadge";
import { themeDefinition } from "@/theme/theme";
import { formatCommuneLibelleWithCodeDepartement, formatDispositifs, formatSecteur } from "@/utils/formatLibelle";
import { formatNumber, formatNumberToString, formatPercentage } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

export const EtablissementItemContent = ({ etablissement }: { etablissement: Etablissement }) => {
  const [hover, setHover] = useState(false);
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
    if (etablissement.tauxDevenirFavorable !== undefined) {
      return `Taux de devenir favorable à 6 mois (Millesimes ${CURRENT_IJ_MILLESIME.split("_").join("+")})`;
    }

    if (isApprentissage && !isScolaire) {
      return `Données indisponibles pour l'apprentissage`;
    }

    return `Données indisponibles`;
  })();

  const tooltipLabelTauxPression = (() => {
    if (etablissement.tauxPression !== undefined) {
      if (etablissement.isBTS) {
        if (isScolaire && isApprentissage) {
          return `Taux de demande voie scolaire (rentrée ${CURRENT_RENTREE})`;
        }

        return `Taux de demande (rentrée ${CURRENT_RENTREE})`;
      }

      if (isScolaire && isApprentissage) {
        return `Taux de pression voie scolaire (rentrée ${CURRENT_RENTREE})`;
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
          <Link
            href={`/panorama/etablissement/${etablissement.uai}`}
            isExternal
            fontWeight={700}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {etablissement.libelleEtablissement}
          </Link>
          {hover && <InlineIcon icon="ri:arrow-right-line" />}
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
          fontSize={12}
          color={themeDefinition.colors.grey[425]}
          divider={<Divider orientation="vertical" h="12px" w="1px" />}
        >
          <Text>
            {formatCommuneLibelleWithCodeDepartement({
              commune: etablissement.commune,
              codeDepartement: etablissement.codeDepartement,
            })}
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
          fontSize={12}
          divider={<Divider h="12px" w="1px" orientation="vertical" />}
          color={themeDefinition.colors.grey[425]}
        >
          <Tooltip label={tooltipLabelEffectif}>
            <HStack gap="4px" width="40px" justifyContent="flex-start" alignItems="center">
              <InlineIcon icon="ri:group-line" height="14px" width="14px" />
              <Text>{formatNumberToString(etablissement.effectifs, 0, "-")}</Text>
            </HStack>
          </Tooltip>
          <Tooltip label={tooltilLabelTauxDevenir}>
            <HStack gap="4px" width="55px" justifyContent="flex-start" alignItems="center">
              <InlineIcon icon="ri:thumb-up-line" height="14px" width="14px" />
              <Text>{formatPercentage(etablissement.tauxDevenirFavorable, 0, "-")}</Text>
            </HStack>
          </Tooltip>
          <Tooltip label={tooltipLabelTauxPression}>
            <HStack gap="4px" width="65px" justifyContent="flex-start" alignItems="center">
              <InlineIcon icon="ri:temp-cold-line" height="14px" width="14px" />
              <TableBadge sx={
                getTauxPressionStyle(
                  etablissement.tauxPression !== undefined ?
                    formatNumber(etablissement.tauxPression, 2) :
                    undefined
                )
              }>
                {formatNumberToString(etablissement.tauxPression, 2, "-")}
              </TableBadge>
            </HStack>
          </Tooltip>
        </HStack>
      </HStack>
    </VStack>
  );
};
