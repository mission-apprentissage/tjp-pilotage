import { Flex,Text} from '@chakra-ui/react';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionFCIL = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ?? "Formation en 1 an, complémentaire à un diplôme de la voie professionnelle et comprenant des périodes entreprise." }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionFCIL = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionFCIL label={label} />}
      onClick={() => openGlossaire("fcil")}
    />
  );
};

export {
  DefinitionFCIL,
  TooltipDefinitionFCIL
};
