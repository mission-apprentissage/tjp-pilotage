import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxEmploi6Mois = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Nombre d’élèves en emploi 6 mois après leur sortie d’études / Nombre de sortants (hors ré-inscrits en formation)." }</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionTauxEmploi6Mois = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxEmploi6Mois label={label}/>}
      onClick={() => openGlossaire("taux-emploi-6-mois")}
    />
  );
};

export {
  DefinitionTauxEmploi6Mois,
  TooltipDefinitionTauxEmploi6Mois
};
