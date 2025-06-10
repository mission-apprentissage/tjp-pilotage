import { Flex,Text} from '@chakra-ui/react';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionEffectifEnEntree = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ?? "Effectifs en entrée en première année de formation." }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
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
