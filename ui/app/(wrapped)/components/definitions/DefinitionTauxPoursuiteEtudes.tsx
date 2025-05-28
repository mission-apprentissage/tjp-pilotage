import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxPoursuiteEtudes = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Nombre d’élèves ré-inscrits en formation à N+1 / Nombre d’inscrits en dernière année (réorientation et redoublement compris)."}</Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionTauxPoursuiteEtudes = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxPoursuiteEtudes label={label} />}
      onClick={() => openGlossaire("taux-poursuite-etudes")}
    />
  );
};

export {
  DefinitionTauxPoursuiteEtudes,
  TooltipDefinitionTauxPoursuiteEtudes
};
