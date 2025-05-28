import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionAMICMA = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Appel à Manifestation d'Intérêt « Compétences et métiers d’avenir »" }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionAMICMA = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionAMICMA label={label} />}
      onClick={() => openGlossaire("ami-cma")}
    />
  );
};

export {
  DefinitionAMICMA,
  TooltipDefinitionAMICMA
};
