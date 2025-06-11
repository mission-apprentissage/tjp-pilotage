import { Flex, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

const DefinitionAMICMA = ({ label }: { label?: string }) => (
  <Flex direction="column" gap={4}>
    <Text>{ label ?? "Appel à Manifestation d'Intérêt « Compétences et métiers d’avenir »" }</Text>
    <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
  </Flex>
);


const TooltipDefinitionAMICMA = ({ label }: { label?: string }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <TooltipIcon
      mx="1"
      label={<DefinitionAMICMA label={label} />}
      onClick={() => openGlossaire("ami-cma")}
    />
  );
};

export {
  DefinitionAMICMA,
  TooltipDefinitionAMICMA
};
