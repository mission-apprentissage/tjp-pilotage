import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionDomaineDeFormation = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Classification des formations professionnelles par spécialité." }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionDomaineDeFormation = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionDomaineDeFormation label={label} />}
      onClick={() => openGlossaire("domaine-de-formation-nsf")}
    />
  );
};

export {
  DefinitionDomaineDeFormation,
  TooltipDefinitionDomaineDeFormation
};
