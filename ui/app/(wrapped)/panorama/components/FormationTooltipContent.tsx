import { Box, HStack, Text } from "@chakra-ui/react";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { PanoramaFormation, PanoramaTopFlop } from "@/app/(wrapped)/panorama/types";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";
import { TableBadge } from "@/components/TableBadge";
import { TooltipIcon } from "@/components/TooltipIcon";
import { feature } from "@/utils/feature";
import { formatNumber } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

type Formation = PanoramaFormation | PanoramaTopFlop;

export const FormationTooltipContent = ({ formation }: { formation: Formation }) => {
  const { openGlossaire } = useGlossaireContext();

  // Si la feature formationsSpecifiqueConsole est activée et que cette formation est concernée, on affiche les tags
  // Sinon si la feature n'est pas activée, on affiche les tags si la formation est une action prioritaire
  const shouldDisplayFormationSpecifique =
    (feature.formationsSpecifiqueConsole && Object.values(formation.formationSpecifique).some((v) => v)) ||
    (!feature.formationsSpecifiqueConsole &&
      formation.formationSpecifique[TypeFormationSpecifiqueEnum["Action prioritaire"]]);

  return (
    <Box bg="white" fontSize="xs" w={"100%"}>
      <InfoBlock mb="2" label="Formation concernée" value={formation?.libelleFormation} />
      <InfoBlock mb="2" label="Dispositif concerné" value={formation?.libelleDispositif} />
      <HStack mb="2" spacing={4}>
        <InfoBlock
          flex={1}
          label={
            <span>
              Effectif en entrée
              <TooltipIcon
                ml="1"
                onClick={() => openGlossaire("effectif-en-entree")}
                label={
                  <Box>
                    <Text>Effectifs en entrée en première année de formation.</Text>
                    <Text>Cliquez pour plus d'infos.</Text>
                  </Box>
                }
              />
            </span>
          }
          value={formation?.effectif}
        />
        <InfoBlock flex={1} label="Nb Etablissements" value={formation?.nbEtablissement} />
      </HStack>

      <InfoBlock
        mb="2"
        label="Taux de pression"
        textBg="white"
        value={
          <TableBadge sx={getTauxPressionStyle(formation?.tauxPression)}>
            {formation.tauxPression !== undefined ? formatNumber(formation?.tauxPression, 2) : "-"}
          </TableBadge>
        }
      />
      <Text mb="1" fontWeight="medium">
        Taux d'emploi régional
      </Text>
      <GraphWrapper mb="2" w="100%" continuum={formation.continuum} value={formation.tauxInsertion} />
      <Text mb="1" fontWeight="medium">
        Taux de poursuite d'études régional
      </Text>
      <GraphWrapper mb="2" w="100%" continuum={formation.continuum} value={formation.tauxPoursuite} />
      <Text mb="1" fontWeight="medium">
        Taux de devenir favorable régional
      </Text>
      <GraphWrapper mb="2" w="100%" continuum={formation.continuum} value={formation.tauxDevenirFavorable} />
      {shouldDisplayFormationSpecifique && (
        <>
          <Text mb="1" fontWeight="medium">
            Formation spécifique
          </Text>
          <BadgesFormationSpecifique formationSpecifique={formation?.formationSpecifique} />
        </>
      )}
    </Box>
  );
};
