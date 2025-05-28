import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionPositionQuadrant = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux d'emploi et de poursuite d'études appliquées au niveau de diplôme." }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionPositionQuadrant = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionPositionQuadrant label={label} />}
      onClick={() => openGlossaire("quadrant")}
    />
  );
};

export {
  DefinitionPositionQuadrant,
  TooltipDefinitionPositionQuadrant
};
