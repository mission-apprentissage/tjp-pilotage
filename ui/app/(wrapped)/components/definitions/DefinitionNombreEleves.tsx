import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionNombreEleves = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Nombre total d’élèves, toutes années de formation confondues." }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionNombreEleves = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionNombreEleves label={label} />}
      onClick={() => openGlossaire("nombre-deleves")}
    />
  );
};

export {
  DefinitionNombreEleves,
  TooltipDefinitionNombreEleves
};
