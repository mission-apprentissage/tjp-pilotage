import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxDevenirFavorable = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "(Nombre d’élèves en emploi + ré-inscrits en formation) / Nombre d’élèves inscrits à la rentrée précédente." }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionTauxDevenirFavorable = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionTauxDevenirFavorable label={label} />}
      onClick={() => openGlossaire("taux-de-devenir-favorable")}
    />
  );
};

export {
  DefinitionTauxDevenirFavorable,
  TooltipDefinitionTauxDevenirFavorable
};
