import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionFCIL = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Formation en 1 an, complémentaire à un diplôme de la voie professionnelle et comprenant des périodes entreprise." }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionFCIL = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionFCIL label={label} />}
      onClick={() => openGlossaire("fcil")}
    />
  );
};

export {
  DefinitionFCIL,
  TooltipDefinitionFCIL
};
