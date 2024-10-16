import { Box, HStack, Text } from "@chakra-ui/react";

import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";
import { TableBadge } from "@/components/TableBadge";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatNumber } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { useGlossaireContext } from "../../glossaire/glossaireContext";
import { PanoramaFormation, PanoramaTopFlop } from "../types";

type Formation = PanoramaFormation | PanoramaTopFlop;

export const FormationTooltipContent = ({
  formation,
}: {
  formation: Formation;
}) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <Box bg="white" fontSize="xs" w={"100%"}>
      <InfoBlock
        mb="2"
        label="Formation concernée"
        value={formation?.libelleFormation}
      />
      <InfoBlock
        mb="2"
        label="Dispositif concerné"
        value={formation?.libelleDispositif}
      />
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
                    <Text>
                      Effectifs en entrée en première année de formation.
                    </Text>
                    <Text>Cliquez pour plus d'infos.</Text>
                  </Box>
                }
              />
            </span>
          }
          value={formation?.effectif}
        />
        <InfoBlock
          flex={1}
          label="Nb Etablissements"
          value={formation?.nbEtablissement}
        />
      </HStack>

      <InfoBlock
        mb="2"
        label="Taux de pression"
        textBg="white"
        value={
          <TableBadge sx={getTauxPressionStyle(formation?.tauxPression)}>
            {formation.tauxPression !== undefined
              ? formatNumber(formation?.tauxPression, 2)
              : "-"}
          </TableBadge>
        }
      />
      <Text mb="1" fontWeight="medium">
        Taux d'emploi régional
      </Text>
      <GraphWrapper
        mb="2"
        w="100%"
        continuum={formation.continuum}
        value={formation.tauxInsertion}
      />
      <Text mb="1" fontWeight="medium">
        Taux de poursuite d'études régional
      </Text>
      <GraphWrapper
        mb="2"
        w="100%"
        continuum={formation.continuum}
        value={formation.tauxPoursuite}
      />
      <Text mb="1" fontWeight="medium">
        Taux de devenir favorable régional
      </Text>
      <GraphWrapper
        w="100%"
        continuum={formation.continuum}
        value={formation.tauxDevenirFavorable}
      />
    </Box>
  );
};
