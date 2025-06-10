import { Flex,Text} from '@chakra-ui/react';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionDomaineDeFormation = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ?? "Classification des formations professionnelles par spécialité." }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
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
