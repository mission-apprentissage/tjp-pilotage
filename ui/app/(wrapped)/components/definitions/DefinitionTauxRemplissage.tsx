import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxRemplissage = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Pour une formation, le ratio entre l’effectif en entrée et la capacité théorique." }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionTauxRemplissage = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionTauxRemplissage label={label} />}
      onClick={() => openGlossaire("taux-de-remplissage")}
    />
  );
};

export {
  DefinitionTauxRemplissage,
  TooltipDefinitionTauxRemplissage
};
