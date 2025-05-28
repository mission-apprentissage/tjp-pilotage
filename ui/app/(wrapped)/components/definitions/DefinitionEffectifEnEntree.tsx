import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionEffectifEnEntree = ({ label }: { label?: string }) => (
  <Box>
    <Text>{ label ?? "Effectifs en entrée en première année de formation." }</Text>
    <Text>Cliquez pour plus d'infos.</Text>
  </Box>
);


const TooltipDefinitionEffectifEnEntree = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      ml="1"
      label={<DefinitionEffectifEnEntree label={label} />}
      onClick={() => openGlossaire("effectif-en-entree")}
    />
  );
};

export {
  DefinitionEffectifEnEntree,
  TooltipDefinitionEffectifEnEntree
};
