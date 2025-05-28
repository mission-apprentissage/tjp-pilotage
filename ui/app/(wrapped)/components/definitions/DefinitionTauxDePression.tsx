import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionTauxDePression = ({ label }: { label?: string }) => (
  <Box>
    <Text>
      { label ?? "Le ratio entre le nombre de premiers voeux et la capacité de la formation au niveau régional." }
    </Text>
    <Text mt={4}>Cliquez pour plus d'infos.</Text>
    <TauxPressionScale />
  </Box>
);

const TooltipDefinitionTauxDePression = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionTauxDePression label={label} />}
      onClick={() => openGlossaire("taux-de-pression")}
    />
  );
};

export {
  DefinitionTauxDePression,
  TooltipDefinitionTauxDePression
};
