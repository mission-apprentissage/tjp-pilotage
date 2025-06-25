import { Flex,Text} from '@chakra-ui/react';
import {CURRENT_IJ_MILLESIME} from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatMillesime } from '@/utils/formatLibelle';

const DefinitionPositionQuadrant = ({ label, millesime }: { label?: string; millesime?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ??
      `Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux d'emploi et de poursuite d'études appliquées au niveau de diplôme
      (millésimes ${formatMillesime(millesime ?? CURRENT_IJ_MILLESIME)}).`
    }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionPositionQuadrant = ({ label, millesime }: { label?: string; millesime?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionPositionQuadrant label={label} millesime={millesime} />}
      onClick={() => openGlossaire("quadrant")}
    />
  );
};

export {
  DefinitionPositionQuadrant,
  TooltipDefinitionPositionQuadrant
};
